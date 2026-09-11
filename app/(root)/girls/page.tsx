import GirlsNavbar from "@/Frontend/components/navbar/GirlsNavbar";
import DisplayCard from "@/Frontend/components/product/DisplayCard/DisplayCard";
import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { Suspense } from "react";

export default function GirlsPage(){
    return(
        <>
        <GirlsNavbar />
        <Suspense fallback={<LoadingBar />}>
            <GirlsDisplaySection />
        </Suspense>
        </>
    )
}


async function GirlsDisplaySection() {
    const products = await GetDisplayProduct();
    const clothing = products.filter(product => {
        const displayProduct = product.slug.startsWith("girls-tshirts-") || product.slug.startsWith("girls-pants-") || product.slug.startsWith("girls-leggings-") || product.slug.startsWith("girls-jeans-") || product.slug.startsWith("girls-dresses-") || product.slug.startsWith("girls-cardigans-") 
        return displayProduct
    })
    const hairAccessoriess = products.filter(product => {
        const displayProduct = product.slug.startsWith("girls-hair-accessories-")
        return displayProduct
    })
    const shoes = products.filter(product => {
        const displayProduct = product.slug.startsWith("girls-shoes-")
        return displayProduct
    })
    const accessories = products.filter(product => {
        const displayProduct = product.slug.startsWith("girls-accessories-")
        return displayProduct
    })
    return(
        <>
        <h1 id="clothing">Clothing</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {clothing.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="hair-accessories">Hair Accessories</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {hairAccessoriess.map((eachProduct:any) => {
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