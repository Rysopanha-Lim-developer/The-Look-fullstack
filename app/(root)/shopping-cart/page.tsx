"use client"

import DisplayCard from "@/Frontend/components/product/DisplayCard/DisplayCard";
import { Product } from "@/Backend/models/product.model";
import { useCart } from "@/Frontend/hooks/CartContext";
import Link from "next/link";

export default function CartPage(){
    const { items } = useCart()

    return(
        <>
            <div className="flex w-full items-center justify-between px-5">
                <h1>My Cart</h1>
                <Link className="btn" href="/shopping-cart/checkout">
                    Checkout Here
                </Link>
            </div>
            <div className="w-full grid grid-cols-4 gap-4 px-2.5">
                {items.map((eachData:Product) => {
                    return <DisplayCard key={eachData.slug} data={eachData} />
                })}
            </div>
        </>
    )
}