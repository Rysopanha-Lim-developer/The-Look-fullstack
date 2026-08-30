"use client"
import { DetailProps } from "@/app/(root)/[slug]/page";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/app/models/product.model";
import ProductDetailSkeleton from "../ProductDetailSkeleton/ProductDetailSkeleton";

export default function ProductDetail({props}: DetailProps) {
    const [detail, setDetail] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDetails() {
            try {
                const res = await fetch  ( `/api/${props.slug}`,{
                                    method: "GET",  
                                }
                            ) 
                const detail:any = await res.json();
                setDetail(detail)
            } catch (error) {
                throw new Error("Product can't be fetch");
            } 
            finally{
                setLoading(false)
            }
        }

        getDetails()
    },[props])

    if (loading) return <ProductDetailSkeleton />;
    if (!detail) return <h1>Product can't be fetch</h1>;

    return(
        <section className="flex flex-col w-full h-[80dvh] items-center justify-evenly">
            <div className="flex w-full h-[80dvh] items-center justify-evenly">
                <div>
                    <Image src={detail.image} alt={detail.image} width={300} height={500} />
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
                <button className="btn">
                    <p>Add to cart</p>
                </button>
                <button className="btn">
                    <p>Add to wishlist</p>
                </button>
            </div>
        </section>
    )
}