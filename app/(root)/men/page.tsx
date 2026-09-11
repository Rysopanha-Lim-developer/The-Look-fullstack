import MenNavbar from "@/Frontend/components/navbar/MenNavbar";
import DisplayCard from "@/Frontend/components/product/DisplayCard/DisplayCard";
import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { Suspense } from "react";

export default function MenPage(){
    return(
        <>
        <MenNavbar />
        <Suspense fallback={<LoadingBar />}>
            <MenDisplaySection />
        </Suspense>
        </>
    )
}


async function MenDisplaySection() {
    const products = await GetDisplayProduct();
    const tshirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-tshirts-")
        return displayProduct
    })
    const shirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-shirts-")
        return displayProduct
    })
    const skirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-shorts-")
        return displayProduct
    })
    const jeansPants = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-jeans-") || product.slug.startsWith("men-pants-")
        return displayProduct
    })
    const shoes = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-shoes-")
        return displayProduct
    })
    const accessories = products.filter(product => {
        const displayProduct = product.slug.startsWith("men-accessories-")
        return displayProduct
    })
    return(
        <>
        <h1 id="tshirts">T-shirts</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {tshirts.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="shirts">Shirts</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {shirts.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="shorts">Shorts</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {skirts.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="jeans-pants">Jeans & Pants</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {jeansPants.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="shoes">Shoes</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {shoes.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="accessories">Accessories</h1>
        <section  className="allProductsSubSection">
        <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
            {accessories.map((eachProduct:any) => {
                return(
                    <DisplayCard key={eachProduct._id} data={eachProduct} />
                )
            })}
        </div>
        </section>
        </>)
}