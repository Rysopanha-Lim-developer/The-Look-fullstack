import { getProductDetail } from "@/app/services/getProductDetail";
import { PageParams } from "@/app/(root)/[slug]/page";

export async function GET(request:Request ,{params}: PageParams){
    // The object key has to be the same as the api route name and the value is what you pass in the url
    const { "product-details": slug }:any = await params;
    const productDetail = await getProductDetail( slug );

    if (!productDetail) {
        return Response.json({  error: "Not found" ,
                                status: 404
                            });
    }
    return Response.json(productDetail);
}