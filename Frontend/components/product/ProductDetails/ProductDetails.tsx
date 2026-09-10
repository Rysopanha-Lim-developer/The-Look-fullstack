"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/Backend/models/product.model";
import ProductDetailSkeleton from "@/Frontend/components/common/ProductDetailLoading/ProductSkeleton";


export default function ProductDetail({props}: {props: Product}) {
    let detail = props
    let [loading, setLoading] = useState(false);
    let [cartItems, setCartItems] = useState<Product[] | null>(null);
    let [favoriteItems, setFavoriteItems] = useState<Product[] | null>(null);

    useEffect(()=> {
        setCartItems(() => {
            const savedItems = localStorage.getItem("cart-items")
            if (!savedItems || savedItems === "undefined" || savedItems === "null") {
                return []
            }
            return JSON.parse(savedItems)
        })
        setFavoriteItems(() => {
            const savedItems = localStorage.getItem("favorite-items")
            if (!savedItems || savedItems === "undefined" || savedItems === "null") {
                return []
            }
            return JSON.parse(savedItems)
        })
    },[])

    useEffect(() => {
        if (cartItems === null || cartItems === undefined) return //This prevent items to reset to [] when the page loaded
        localStorage.setItem("cart-items", JSON.stringify(cartItems))
    }, [cartItems]);

    useEffect(() => {
        if (favoriteItems === null || favoriteItems === undefined) return //This prevent items to reset to [] when the page loaded
        localStorage.setItem("favorite-items", JSON.stringify(favoriteItems))
    }, [favoriteItems]);

    function AddItemToCart(){
        if (!detail) {
            return; 
        }
        setCartItems(cartItems => ([...cartItems?? [], detail]))
    };
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
                <button className="btn" onClick={AddItemToCart}>
                    <p>Add to cart</p>
                </button>
                <button className="btn" onClick={AddItemToFavorite}>
                    <p>Add to favorite</p>
                </button>
            </div>
        </section>
    )
}