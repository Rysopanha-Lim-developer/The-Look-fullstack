import { getProductDetail } from "@/app/services/getProductDetail";
import { PageParams } from "@/app/(root)/[slug]/page";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest ,{params}: PageParams){
    // The object key has to be the same as the api route name and the value is what you pass in the url
    const { "product-details": slug }:any = await params;
    const productDetail = await getProductDetail( slug );

    return NextResponse.json(productDetail);
}