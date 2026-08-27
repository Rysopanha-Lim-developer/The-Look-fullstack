import { Schema, model, models, Document, ObjectId, Types } from "mongoose";
import mongoose from "mongoose";

export type Product = {
    _id: Types.ObjectId,
    ok: boolean,
    id: string,
    brand: string,
    name: string,
    color: string,
    material: string,
    price: number,
    image: string
};

const ProductSchema = new Schema<Product>(
    {
        _id: {type: Types.ObjectId, required: true},
        ok: {type: Boolean, required: true},
        id: {type: String, required: true},
        brand: {type: String, required: true},
        name: {type: String, required: true},
        color: {type: String, required: true},
        material: {type: String, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: true},
    }
);

const productDB = mongoose.connection.useDb("Clothing-Datas", {useCache: true});

export const ProductModel = productDB.models.ProductModel || productDB.model<Product>("ProductModel", ProductSchema, "all_clothing")