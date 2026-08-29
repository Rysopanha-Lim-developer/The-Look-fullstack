import { Product } from "@/app/models/product.model";
import LoadingBar from "@/app/components/LoadingBar/LoadingBar";
import { Suspense } from "react";
import { connection } from "next/server";
import ProductDetail from "@/app/components/ProductDetails/ProductDetails";


export type PageParams = {
    params: Promise<Pick<Product, "slug">>
}

export type DetailProps = {
    props: Pick<Product, "slug">
}

export default function DetailPage({params}: PageParams){
    return(
        <Suspense fallback={<DetailsSkeleton/>}>'
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

function DetailsSkeleton() {
    return (<LoadingBar />)
}