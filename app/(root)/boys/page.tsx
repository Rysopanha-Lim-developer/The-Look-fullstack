import BoysNavbar from "@/Frontend/components/navbar/BoysNavbar";
import DisplayCard from "@/Frontend/components/product/DisplayCard/DisplayCard";
import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { Suspense } from "react";

export default function BoysPage(){
    return(
        <>
        <BoysNavbar />
        <Suspense fallback={<LoadingBar />}>
            <BoysDisplaySection />
        </Suspense>
        </>
    )
}

async function BoysDisplaySection(){
    const products = await GetDisplayProduct();
    const clothing = products.filter(product => {
        const displayProduct = product.slug.startsWith("boys-tshirts-") || product.slug.startsWith("boys-joggers-") 
        return displayProduct
    })
    const shoes = products.filter(product => {
        const displayProduct = product.slug.startsWith("boys-shoes-")
        return displayProduct
    })
    const accessories = products.filter(product => {
        const displayProduct = product.slug.startsWith("boys-accessories-")
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