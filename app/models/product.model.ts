import { Schema, model, models } from "mongoose";

export type Product = {
    brand: string,
    name: string,
    color: string,
    material: string,
    price: number,
    image: string,
    slug: string,
    quantity?: number
};

const ProductSchema = new Schema<Product>(
    //In future project should add a SKU  (Stock Keeping Unit)
    /*
    ###Purpose of sku
    1. Tracking exact inventory counts
    2. Telling apart identical-looking products (Ex:same name, price, brand; but not color)
    3. Communicating with the outside world (shipping...)
    4. Fast, human-searchable lookup
    5. Preventing your own inventory chaos
    */
    //follow this format [BRAND]-[CATEGORY]-[STYLE/MODEL]-[COLOR]-[SIZE]
    //Example: sku: { type: String, required: true, unique: true, uppercase: true }, 
    // "PS-SUN-3308S-MBK-OS." 
    /*
    ###Sku break down
    PS: Brand (Persol)
    SUN: Category (Sunglasses)3308S: 
    Model/Style (From PO3308S)MBK: 
    Color (Matte Black)
    OS: Size (One Size - standard for accessories when size is missing)
    */
    {
        brand: {type: String, required: true},
        name: {type: String, required: true},
        color: {type: String, required: true},
        material: {type: String, required: true},
        price: {type: Number, required: true, min:0},
        image: {type: String, required: true},
        slug: {type: String, required: true, unique:true}, //this id can be used as a slug in url
    }
);

// --- Indexes can pre-sort the data in accending order(1) and deccending order(-1)

ProductSchema.index({ name: "text", brand: "text", slug: "text" }); // enables text search across name + brand

ProductSchema.index({ brand: 1, price: -1 });   /*fast filter by brand, sorted by price
                                                and when using the .find({brand:""}) or .find({price:""})
                                                or .find({theFieldAvailable in the index: ""})
                                                it will perform instance look => faster query*/ 


export const ProductModel = models.ProductModel || model<Product>("ProductModel", ProductSchema, "all_clothing")