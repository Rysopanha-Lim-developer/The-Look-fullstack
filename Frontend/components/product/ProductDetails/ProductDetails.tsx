"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/Frontend/hooks/CartContext";
import { Product } from "@/Backend/models/product.model";
import ProductDetailSkeleton from "@/Frontend/components/common/ProductDetailLoading/ProductSkeleton";


export default function ProductDetail({props}: {props: Product}) {
    const { addItem } = useCart()
    let detail = props
    let [loading, setLoading] = useState(false);
    let [favoriteItems, setFavoriteItems] = useState<Product[] | null>(null);

    useEffect(()=> {
        setFavoriteItems(() => {
            const savedItems = localStorage.getItem("favorite-items")
            if (!savedItems || savedItems === "undefined" || savedItems === "null") {
                return []
            }
            return JSON.parse(savedItems)
        })
    },[])

    useEffect(() => {
        if (favoriteItems === null || favoriteItems === undefined) return //This prevent items to reset to [] when the page loaded
        localStorage.setItem("favorite-items", JSON.stringify(favoriteItems))
    }, [favoriteItems]);

    function AddItemToFavorite(){
        if (!detail) {
            return; 
        }
        setFavoriteItems(favoriteItems => ([...favoriteItems?? [], detail]))
    };

    if (loading) return <ProductDetailSkeleton />;
    detail ? loading = false : <h1>Product can't be fetch</h1>;

    return(
        <section className="flex flex-col w-full h-[90dvh] items-center justify-evenly">
            <div className="flex w-full h-[80dvh] items-center justify-evenly">
                <div>
                    <Image src={detail.image} alt={detail.image} width={300} height={400} />
                </div>
                <div>
                    <div className="leading-5">
                        <h1>Brand</h1>
                        <h2>{detail.brand}</h2>
                    </div>
                    <div className="leading-5">
                        <h1>Name</h1>
                        <h2>{detail.name}</h2>
                    </div>
                    <div className="leading-5">
                        <h1>Price</h1>
                        <h2>{detail.price}</h2>
                    </div>
                    <div className="leading-5">
                        <h1>Available Color </h1>
                        <h2>{detail.color}</h2>
                    </div>
                    <div className="leading-5">
                        <h1>Materials</h1>
                        <h2>{detail.material}</h2>
                    </div>
                </div>
            </div>
            <div className=" flex w-full justify-center gap-5">
                <button className="btn" onClick={()=>{addItem(detail)}}>
                    Add to cart
                </button>
                <button className="btn" onClick={AddItemToFavorite}>
                    Add to favorite
                </button>
            </div>
        </section>
    )
}