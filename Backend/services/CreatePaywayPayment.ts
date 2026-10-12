import z from "zod";
import { OrderModel } from "@/Backend/models/order.model";
import { HttpError } from "@/Backend/lib/errors";
import { generateQr, PAYWAY_CURRENCY } from "@/Backend/lib/payway";
import { PrepareOrder, type CreateOrderPayload } from "@/Backend/services/CreateOrder";

const QR_LIFETIME_MINUTES = 10;

const itemsSchema = z.array(z.object({ _id: z.string().min(1) })).min(1).max(50);

// A new id for every payment attempt (PayWay allows up to 20 characters): the time in ms plus 3 random digits.
const newTranId = () => `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

const round2 = (value: number) => Math.round(value * 100) / 100;

// Creates a PENDING order, asks PayWay for a QR code and returns what the payment page needs.
// The amount always comes from the database prices (PrepareOrder), never from the browser.
export async function CreatePaywayPayment(payload: CreateOrderPayload) {
    if (!itemsSchema.safeParse(payload?.items).success) {
        throw new HttpError("Please complete your delivery details and cart", 400);
    }
    const { accountId, userPersonalInfo, orderItems, productMap } = await PrepareOrder(payload);

    const amount = round2(orderItems.reduce((sum, item) => sum + item.priceAtPurchase * (item.quantity ?? 1), 0));
    if (!(amount > 0)) {
        throw new HttpError("The order total must be more than zero.", 400);
    }

    // One open QR code per customer: close any older unpaid ones.
    // (If one of them is paid later anyway, ConfirmPaywayPayment still accepts it.)
    await OrderModel.updateMany(
        { accountId, status: "pending" },
        { $set: { status: "expired" }, $unset: { "payment.qrString": "", "payment.qrImage": "", "payment.deeplink": "" } },
    );

    const tranId = newTranId();
    const order = await OrderModel.create({
        accountId,
        userPersonalInfo,
        orderItems,
        status: "pending",
        payment: { provider: "payway", tranId, amount, currency: PAYWAY_CURRENCY },
    });

    try {
        const qr = await generateQr({
            tranId,
            amount,
            items: orderItems.map((item) => ({
                name: (productMap.get(String(item.productId))?.name ?? "Item").slice(0, 60),
                quantity: item.quantity ?? 1,
                price: item.priceAtPurchase,
            })),
            customer: {
                firstName: userPersonalInfo.firstname,
                lastName: userPersonalInfo.lastname,
                email: userPersonalInfo.email,
                phone: userPersonalInfo.telephone,
            },
            lifetimeMinutes: QR_LIFETIME_MINUTES,
        });

        const expiresAt = new Date(Date.now() + QR_LIFETIME_MINUTES * 60_000);
        await OrderModel.updateOne(
            { _id: order._id },
            { $set: { "payment.qrString": qr.qrString, "payment.qrImage": qr.qrImage, "payment.deeplink": qr.deeplink, "payment.expiresAt": expiresAt } },
        );
    } catch (error) {
        // No QR code means nothing can be paid, so do not leave a "pending" order behind.
        await OrderModel.updateOne({ _id: order._id }, { $set: { status: "failed" } });
        throw error;
    }

    return { orderId: String(order._id) };
}
