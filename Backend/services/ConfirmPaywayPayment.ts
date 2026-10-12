import { dbConnection } from "@/Backend/lib/dbConnection";
import { OrderModel, type Order } from "@/Backend/models/order.model";
import { checkTransaction, type CheckResult } from "@/Backend/lib/payway";

export type PaymentOutcome = "paid" | "pending" | "declined" | "unknown-order";

// An approved payment only counts if it is for the amount and currency WE asked for.
export function paymentMatches(expected: { amount: number; currency: string }, check: CheckResult): boolean {
    return (
        check.amount !== undefined &&
        Math.abs(check.amount - expected.amount) < 0.005 &&
        (check.currency === undefined || check.currency === expected.currency)
    );
}

// The one place an order becomes "paid". Used by BOTH the status endpoint (polling) and the callback.
// Never trusts what the browser or the callback body says: it asks PayWay directly (Check Transaction API).
export async function ConfirmPaywayPayment(tranId: string): Promise<PaymentOutcome> {
    await dbConnection();
    const order: Order | null = await OrderModel.findOne({ "payment.tranId": tranId }).lean();
    if (!order || !order.payment) return "unknown-order";
    if (order.status === "paid") return "paid";

    const check = await checkTransaction(tranId);

    if (check.state === "approved") {
        if (!paymentMatches(order.payment, check)) {
            // Money arrived but not the amount we expected. Do not mark it paid; a person must look at it.
            console.error("[payway] approved payment does not match the order", {
                tranId, expected: order.payment.amount, got: check.amount, currency: check.currency,
            });
            return "pending";
        }
        // The status filter makes this safe to run twice (two callbacks, or a callback and a poll at once):
        // only the first one finds a pending/expired order. An order that ran out of time is still paid if the money did arrive.
        await OrderModel.updateOne(
            { _id: order._id, status: { $in: ["pending", "expired"] } },
            {
                $set: { status: "paid", "payment.paidAt": new Date(), ...(check.apv ? { "payment.apv": check.apv } : {}) },
                $unset: { "payment.qrString": "", "payment.qrImage": "", "payment.deeplink": "" },
            },
        );
        return "paid";
    }

    if (check.state === "declined") {
        await OrderModel.updateOne({ _id: order._id, status: "pending" }, { $set: { status: "failed" } });
        return "declined";
    }

    return "pending";
}
