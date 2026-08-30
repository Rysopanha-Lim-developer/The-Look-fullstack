import { dbConnection } from "@/app/lib/dbConnection";
import { ProductModel } from "@/app/models/product.model";
import { Product } from "@/app/models/product.model";
import { NextResponse } from "next/server";

export async function getProductDetail(slug: {slug: Pick<Product, "slug">}){
    try {
        await dbConnection();
        //findOne method required object that why we use {slug} and not slug
        const detail = await ProductModel.findOne({ slug }).lean();
        if(!detail){
            return NextResponse.json(
                { message: "Product Not Found"},
                { status: 404 }
            )
        }
        return detail;
    } catch (error:any) {
        return NextResponse.json(
                { message: error.message ||"Something when wrong"},
                { status: 500 }
            )
    }
}