import WomenNavbar from "@/Frontend/components/navbar/WomenNavbar";
import DisplayCard from "@/Frontend/components/product/DisplayCard/DisplayCard";
import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { Suspense } from "react";

export default function WomenPage(){
    
    return(
        <>
        <WomenNavbar />
        <Suspense fallback={<LoadingBar />}>
            <WomenDisplaySection />
        </Suspense>
        </>
    )
}

async function WomenDisplaySection(){
    const products = await GetDisplayProduct();
    const tshirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-tshirts-")
        return displayProduct
    })
    const shirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-shirts-")
        return displayProduct
    })
    const skirts = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-skirts-")
        return displayProduct
    })
    const dresses = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-dresses-")
        return displayProduct
    })
    const jeansPants = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-jeans-") || product.slug.startsWith("women-pants-")
        return displayProduct
    })
    const shoes = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-shoes-")
        return displayProduct
    })
    const accessories = products.filter(product => {
        const displayProduct = product.slug.startsWith("women-accessories-")
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
        <h1 id="skirts">Skirts</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {skirts.map((eachProduct:any) => {
                    return(
                        <DisplayCard key={eachProduct._id} data={eachProduct} />
                    )
                })}
            </div>
        </section>
        <h1 id="dresses">Dresses</h1>
        <section  className="allProductsSubSection">
            <div className="w-full h-auto flex gap-5 mt-o mb-0 ml-2.5 mr-2.5">
                {dresses.map((eachProduct:any) => {
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
        </>
    )
}