import { Schema, model, models, Document, ObjectId, Types } from "mongoose";
import mongoose from "mongoose";

export type Product = {
    _id: Types.ObjectId,
    brand: string,
    name: string,
    color: string,
    material: string,
    price: number,
    image: string,
    slug: string
};

const ProductSchema = new Schema<Product>(
    //In future project should add a SKU  (Stock Keeping Unit)
    //follow this format [BRAND]-[CATEGORY]-[STYLE/MODEL]-[COLOR]-[SIZE]
    //Example: sku: { type: String, required: true, unique: true, uppercase: true }, 
    // "PS-SUN-3308S-MBK-OS." 
    // Sku break down
    /*
    PS: Brand (Persol)
    SUN: Category (Sunglasses)3308S: 
    Model/Style (From PO3308S)MBK: 
    Color (Matte Black)
    OS: Size (One Size - standard for accessories when size is missing)
    */
    {
        _id: {type: Types.ObjectId, required: true}, //this _id if for item look up
        brand: {type: String, required: true},
        name: {type: String, required: true},
        color: {type: String, required: true},
        material: {type: String, required: true},
        price: {type: Number, required: true, min:0},
        image: {type: String, required: true},
        slug: {type: String, required: true, unique:true}, //this id can be used as a slug in url
    }
);

const productDB = mongoose.connection.useDb("Clothing-Datas", {useCache: true});

export const ProductModel = productDB.models.ProductModel || productDB.model<Product>("ProductModel", ProductSchema, "all_clothing")