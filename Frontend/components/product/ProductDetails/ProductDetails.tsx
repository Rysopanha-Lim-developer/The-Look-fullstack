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

    return (
        <section className="flex flex-col w-full h-[90dvh] items-center justify-evenly">
            <div className="flex w-full h-[80dvh] items-center justify-evenly">
                <div>
                    <Image
                        src={detail.image}
                        alt={`${detail.brand} ${detail.name}`}
                        width={300}
                        height={400}
                        priority
                    />
                </div>
                <div>
                    <h1>{detail.name}</h1>
                    <dl>
                        <div className="leading-5">
                            <dt className="text-2xl font-semibold">Brand</dt>
                            <dd>{detail.brand}</dd>
                        </div>
                        <div className="leading-5">
                            <dt className="text-2xl font-semibold">Price</dt>
                            <dd>${detail.price}</dd>
                        </div>
                        <div className="leading-5">
                            <dt className="text-2xl font-semibold">Available Color</dt>
                            <dd>{detail.color}</dd>
                        </div>
                        <div className="leading-5">
                            <dt className="text-2xl font-semibold">Materials</dt>
                            <dd>{detail.material}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="flex w-full justify-center gap-5">
                <button className="btn" onClick={() => { addItem(detail) }}>
                    Add to cart
                </button>
                <button className="btn" onClick={AddItemToFavorite}>
                    Add to favorite
                </button>
            </div>
        </section>
    )
}