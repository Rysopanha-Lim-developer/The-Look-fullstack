import { dbConnection } from "@/app/lib/dbConnection";
import { ProductModel } from "@/app/models/product.model";
import { Product } from "@/app/models/product.model";

export async function getProductDetail(slug: {slug: Pick<Product, "slug">}){
    await dbConnection();
    //findOne method required object that why we use {slug} and not slug
    const detail = await ProductModel.findOne({ slug }).lean();
    return detail;
}