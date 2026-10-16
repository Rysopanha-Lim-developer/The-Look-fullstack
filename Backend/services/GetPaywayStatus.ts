import { Types } from "mongoose";
import { HttpError } from "@/Backend/lib/errors";
import { OrderModel, type Order, type OrderStatus } from "@/Backend/models/order.model";
import { ProductModel, type Product } from "@/Backend/models/product.model";
import { GetCurrentAccount } from "@/Backend/services/CurrentAccount";
import { ConfirmPaywayPayment } from "@/Backend/services/ConfirmPaywayPayment";
import { isSandbox } from "@/Backend/lib/payway";

const MIN_MS_BETWEEN_PAYWAY_CHECKS = 3000;
const GRACE_MS_AFTER_EXPIRY = 30_000; // PayWay and our clock may differ a little; also lets a last-second payment arrive

export type PaymentStatus = {
    orderId: string;
    status: OrderStatus;
    amount: number;
    currency: string;
    testMode: boolean; // true on the PayWay sandbox: the page says so, because no real money moves
    expiresAt?: string;
    // only while pending
    qrImage?: string;
    qrString?: string;
    deeplink?: string;
    // only when paid: everything the receipt needs
    receipt?: {
        createdAt: string;
        paidAt?: string;
        info: Order["userPersonalInfo"];
        items: { name: string; color?: string; price: number }[];
        total: number;
    };
};

// What the payment page asks every few seconds. The signed-in customer can only see THEIR OWN orders.
export async function GetPaywayStatus(orderId: string): Promise<PaymentStatus> {
    const { accountId } = await GetCurrentAccount();
    if (!Types.ObjectId.isValid(orderId)) throw new HttpError("Order not found.", 404);

    const load = (): Promise<Order | null> => OrderModel.findOne({ _id: orderId, accountId }).lean();
    let order = await load();
    if (!order || !order.payment?.tranId) throw new HttpError("Order not found.", 404);

    if (order.status === "pending") {
        const claimed = await OrderModel.findOneAndUpdate(
            {
                _id: orderId,
                accountId,
                status: "pending",
                $or: [
                    { "payment.lastCheckedAt": null }, // null also matches "the field does not exist yet"
                    { "payment.lastCheckedAt": { $lt: new Date(Date.now() - MIN_MS_BETWEEN_PAYWAY_CHECKS) } },
                ],
            },
            { $set: { "payment.lastCheckedAt": new Date() } },
        ).select("_id").lean();

        if (claimed) {
            try {
                await ConfirmPaywayPayment(order.payment.tranId);
            } catch (error) {
                // PayWay being slow or down must not break the page: keep showing "waiting" and try again on the next poll
                console.error("[payway] status check failed:", error);
            }
            order = (await load()) ?? order;
        }

        const expiresAt = order.payment?.expiresAt ? new Date(order.payment.expiresAt).getTime() : 0;
        if (order.status === "pending" && expiresAt && Date.now() > expiresAt + GRACE_MS_AFTER_EXPIRY) {
            await OrderModel.updateOne(
                { _id: orderId, status: "pending" },
                { $set: { status: "expired" }, $unset: { "payment.qrString": "", "payment.qrImage": "", "payment.deeplink": "" } },
            );
            order = (await load()) ?? order;
        }
    }

    const payment = order.payment!;
    const status: OrderStatus = order.status ?? "pending";
    const result: PaymentStatus = {
        orderId: String(order._id),
        status,
        amount: payment.amount,
        currency: payment.currency,
        testMode: isSandbox(),
        expiresAt: payment.expiresAt ? new Date(payment.expiresAt).toISOString() : undefined,
    };

    if (status === "pending") {
        result.qrImage = payment.qrImage;
        result.qrString = payment.qrString;
        result.deeplink = payment.deeplink;
    }

    if (status === "paid") {
        const ids = order.orderItems.map((item) => item.productId);
        const products: Product[] = await ProductModel.find({ _id: { $in: ids } }).lean();
        const byId = new Map(products.map((p) => [String(p._id), p]));
        result.receipt = {
            createdAt: new Date(order.createdAt).toISOString(),
            paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString() : undefined,
            info: order.userPersonalInfo,
            items: order.orderItems.map((item) => {
                const product = byId.get(String(item.productId));
                return { name: product?.name ?? "Item", color: product?.color, price: item.priceAtPurchase };
            }),
            total: payment.amount,
        };
    }

    return result;
}
