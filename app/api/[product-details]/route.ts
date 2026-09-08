import { Product } from "@/Backend/models/product.model";
import { GetProductDetail } from "@/Backend/services/GetProductDetail";
import { NextRequest, NextResponse } from "next/server";

export type PageParams = {
    params: Promise<Pick<Product, "slug">>
}
export async function GET(request:NextRequest ,{params}: PageParams){
    // The object key has to be the same as the api route name and the value is what you pass in the url
    const { "product-details": slug }:any = await params;
    const productDetail = await GetProductDetail( slug );

    return NextResponse.json(productDetail);
}