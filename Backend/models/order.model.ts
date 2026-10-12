import { Schema, Types, model, models } from "mongoose";
import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";

export type OrderItem = {
    productId: string;
    priceAtPurchase: number;
    quantity?: number;
};

// "pending"  = QR created, waiting for the customer to pay
// "paid"     = PayWay confirmed the payment (always verified with the Check Transaction API)
// "expired"  = nobody paid before the QR code ran out
// "failed"   = PayWay declined it, or we could not create the QR code
// Orders made before online payment existed have NO status. Treat a missing status as "paid" (the old demo flow).
export const ORDER_STATUSES = ["pending", "paid", "expired", "failed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderPayment = {
    provider: "payway";
    tranId: string; // the id we send to PayWay (max 20 characters)
    amount: number; // what we asked for, calculated on the server
    currency: string;
    qrString?: string; // removed again once the order is no longer pending
    qrImage?: string;
    deeplink?: string;
    expiresAt?: Date;
    lastCheckedAt?: Date; // stops the status endpoint from asking PayWay more than once every few seconds
    paidAt?: Date;
    apv?: string; // approval code from PayWay
};

export type Order = {
    _id: string;
    accountId: Types.ObjectId;
    userPersonalInfo: UserPersonalInfo;
    orderItems: OrderItem[];
    status?: OrderStatus;
    payment?: OrderPayment;
    createdAt:Date
};

const OrderSchema = new Schema<Order>(
    {
        accountId: { type: Schema.Types.ObjectId, required: true, ref: "UserModel" },
        userPersonalInfo: {type: Object, required: true},
        orderItems: [
            {
                productId: { type: Schema.Types.ObjectId, required: true, ref: "ProductModel" },
                priceAtPurchase: { type: Number, required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
        // No default on purpose: a default would silently mark a forgotten order as "paid" or "pending".
        status: { type: String, enum: ORDER_STATUSES },
        payment: {
            provider: { type: String, enum: ["payway"] },
            tranId: String,
            amount: Number,
            currency: String,
            qrString: String,
            qrImage: String,
            deeplink: String,
            expiresAt: Date,
            lastCheckedAt: Date,
            paidAt: Date,
            apv: String,
        },
    },
    { 
        timestamps: true 
    }
);
OrderSchema.index({ accountId: 1, createdAt: -1 });

// Each tranId must be unique, but only orders that HAVE one are checked.
// A plain `unique: true` would treat every old order (no tranId) as "null" and reject the second one,
// the same problem as the old hashedCrediential index on users. partialFilterExpression avoids that.
OrderSchema.index(
    { "payment.tranId": 1 },
    { unique: true, partialFilterExpression: { "payment.tranId": { $type: "string" } } },
);


export const OrderModel = models.OrderModel || model("OrderModel", OrderSchema, "orders")
