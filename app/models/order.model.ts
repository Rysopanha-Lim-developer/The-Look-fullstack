import { Schema, Types, model, models } from "mongoose";
import type { userPersonalInfo } from "../lib/Types/generalTypes.module";

export type OrderItem = {
    product: Types.ObjectId;
    quantity: number;
};

export type Order = {
    username: Types.ObjectId;
    userInfo: userPersonalInfo;
    items: OrderItem[];
};

const OrderSchema = new Schema<Order>(
    {
        username: { type: Schema.Types.ObjectId, required: true, ref: "UserModel" },
        userInfo: {required: true},
        items: [
            {
                product: { type: Schema.Types.ObjectId, required: true, ref: "ProductModel" },
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