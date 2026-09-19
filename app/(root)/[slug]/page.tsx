import { Product, ProductModel } from "@/Backend/models/product.model";
import { Suspense } from "react";
import { dbConnection } from "@/Backend/lib/dbConnection";
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
        <Suspense fallback={<ProductDetailSkeleton/>}>
            <Details params={params}/>
        </Suspense>
    )
}

async function Details({params}:PageParams) {
    await dbConnection();
    const {slug} = await params;
    let productDetail:Product = await ProductModel.findOne({slug: slug}).lean()
    productDetail = JSON.parse(JSON.stringify(productDetail))

    return(
        <ProductDetail props={productDetail}/>
    )
}