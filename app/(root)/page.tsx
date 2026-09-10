import InfiniteLogoScroll from "@/Frontend/components/maketing/InfiniteLogoScroll/InfiniteLogoScroll";
import Image from "next/image";
import DisplayCard, { DisplayCardProps } from "@/Frontend/components/product/DisplayCard/DisplayCard";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";

import { Product } from "@/Backend/models/product.model";
import { GetProductDetail, GetPrice } from "@/Backend/services/GetProductDetail";
/*
`connection()` is Next.js 16's primitive (under the new `cacheComponents` model)
that tells Next: "this part of the tree must be rendered dynamically,
per-request — do NOT try to prerender/cache it as static HTML."
It replaces the old `export const dynamic = 'force-dynamic'` route config.
*/
import { Suspense } from "react";


//main page body
export default function Home() {
    return (<>
        <div>
            <Image src="/assets/Banner/BigSaleBanner.jpg" alt="Sale banner" width={1200} height={100} className="w-dvw h-auto" />
        </div>
        <InfiniteLogoScroll />

        <Suspense fallback={<LoadingBar />}>
            <Products />
        </Suspense>
        {/* <Suspense> is the boundary that tells Next.js:
            "Everything inside here is allowed to be dynamic/slow.
            Show `fallback` immediately as part of the static shell,
            then stream in the real content once it's ready."
            Without this boundary, Next has nowhere to "cut" the tree,
            so the dynamic data access inside <Products /> would force
            the ENTIRE page to block on every request (the error you hit). */}
    </>);
}

//Make db connection and query here instead
async function Products() {
    //Get the detail and price of each product
    const detail = await GetProductDetail();
    const price:{_id: string, price: number}[] = await GetPrice(detail.map((p:{_id: string, price: number}) => p._id))

    //Create a key value map as reference
    const liveData = new Map(price.map((e:{_id: string, price: number}): [string, { _id: string; price: number }] => [e._id, e]))

    //Combine both array by matching there _id
    const products:Product[] = detail.map((eachDetail:Product) => ({
        ...eachDetail,
        price: liveData.get(eachDetail._id)?.price ?? null,
    }))

    //filter to get specific data
    const filteredData = products.filter(product =>{return product.slug.startsWith("men-accessories") || product.price == 100});

    return (
        <>
            <h1>New Product</h1>
            <section className="allProductsSubSection">
                <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                    {filteredData.map((eachProduct:any) => {
                        return(
                            <DisplayCard key={eachProduct._id} data={eachProduct} />
                        )
                    })}
                </div>
            </section>
        </>
    )
}