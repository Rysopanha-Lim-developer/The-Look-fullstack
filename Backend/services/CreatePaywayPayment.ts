import z from "zod";
import { randomInt } from "node:crypto";
import { OrderModel } from "@/Backend/models/order.model";
import { HttpError } from "@/Backend/lib/errors";
import { generateQr, PAYWAY_CURRENCY } from "@/Backend/lib/payway";
import { PrepareOrder, type CreateOrderPayload } from "@/Backend/services/CreateOrder";

const QR_LIFETIME_MINUTES = 10;

// Only real MongoDB ids pass, so a bad id is a 400 instead of a Mongoose CastError (500).
const itemsSchema = z.array(z.object({ _id: z.string().regex(/^[a-f\d]{24}$/i) })).min(1).max(50);

// A new id for every payment attempt (PayWay allows up to 20 characters): 13 digits of time + 3 random digits.
const newTranId = () => `${Date.now()}${randomInt(100, 1000)}`;

const round2 = (value: number) => Math.round(value * 100) / 100;

// Same products = same key, whatever the order of the cart.
const cartKey = (items: { productId: unknown }[]) => items.map((item) => String(item.productId)).sort().join(",");

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

    // Same cart, same price, QR still valid: show the same QR again instead of making a second one.
    const open = await OrderModel.findOne({
        accountId,
        status: "pending",
        "payment.expiresAt": { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (open && open.payment?.amount === amount && cartKey(open.orderItems) === cartKey(orderItems)) {
        // The delivery details may have changed since the QR was made; the order is still unpaid, so update them.
        await OrderModel.updateOne({ _id: open._id, status: "pending" }, { $set: { userPersonalInfo } });
        return { orderId: String(open._id) };
    }

    // Different cart: close older unpaid orders. Their QR can still be scanned at PayWay until it expires,
    // so a reconciliation job should check them with Check Transaction.
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
        const startedAt = Date.now(); // before the call, so our countdown is never longer than PayWay's
        const qr = await generateQr({
            tranId,
            amount,
            items: orderItems.map((item) => ({
                name: (productMap.get(String(item.productId))?.name ?? "Item").slice(0, 60),
                quantity: item.quantity ?? 1,
                price: item.priceAtPurchase,
            })),
            customer: {
                // PayWay's length and character limits for these are applied inside generateQr (payway.ts)
                firstName: userPersonalInfo.firstname,
                lastName: userPersonalInfo.lastname,
                email: userPersonalInfo.email,
                phone: userPersonalInfo.telephone,
            },
            lifetimeMinutes: QR_LIFETIME_MINUTES,
        });

        const expiresAt = new Date(startedAt + QR_LIFETIME_MINUTES * 60_000);
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
