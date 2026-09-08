import { Schema, Types, model, models } from "mongoose";
import type { UserPersonalInfo } from "../lib/Types/generalTypes.module";

export type OrderItem = {
    productId: Types.ObjectId;
    priceAtPurchase: number;
    quantity?: number;
};

export type Order = {
    accountId: Types.ObjectId;
    userPersonalInfo: UserPersonalInfo;
    items: OrderItem[];
};

const OrderSchema = new Schema<Order>(
    {
        accountId: { type: Schema.Types.ObjectId, required: true, ref: "UserModel" },
        userPersonalInfo: {type: Object, required: true},
        items: [
            {
                productId: { type: Schema.Types.ObjectId, required: true, ref: "ProductModel" },
                priceAtPurchase: { type: Number, required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
    },
    { 
        timestamps: true 
    }
);


export const OrderModel = models.OrderModel || model("OrderModel", OrderSchema, "orders")