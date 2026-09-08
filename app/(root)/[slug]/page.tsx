import { Product } from "@/Backend/models/product.model";
import { Suspense } from "react";
import { connection } from "next/server";
import ProductDetail from "@/Frontend/components/product/ProductDetails/ProductDetails";
import ProductDetailSkeleton from "@/Frontend/components/common/ProductDetailLoading/ProductSkeleton";

export type PageParams = {
    params: Promise<Pick<Product, "slug">>
}

export type DetailProps = {
    props: Pick<Product, "slug">
}

export default function DetailPage({params}: PageParams){
    return(
        <Suspense fallback={<ProductDetailSkeleton/>}>'
            <Details params={params}/>
        </Suspense>
    )
}

async function Details({params}:PageParams) {
    await connection();
    const productSlug = await params;
    return(
        <ProductDetail props={productSlug}/>
    )
}