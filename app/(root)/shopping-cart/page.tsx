"use client"

import DisplayCard from "@/app/components/product/DisplayCard/DisplayCard";
import { Product } from "@/app/models/product.model";
import { useEffect, useState } from "react";

export default function CartPage(){
    // this state and useEffect is for rendering
    let [cartData, setCartData] = useState<Product[]>([]);

    useEffect(() => {
        //This useEffect help clear out duplicate data from the local sotorage
        const unfilteredData:[] = JSON.parse(localStorage.getItem("cart-items")?? "[]")

        const filteredData = unfilteredData.filter((item:any, index:any, self:any) => 
            index === self.findIndex((t:any) => t._id === item._id)
        );

        setCartData(filteredData)
        localStorage.setItem("cart-items", JSON.stringify(filteredData))
    }, [])

    return(
        <>
            <div className="flex w-full items-center justify-between px-5">
                <h1>My Cart</h1>
                <a href="/shopping-cart/checkout">
                    <button className="btn">Checkout Here</button>
                </a>
            </div>
            <div className="w-full grid grid-cols-4 gap-4 px-2.5">
                {cartData.map((eachData:Product) => {
                    return <DisplayCard key={eachData.slug} data={eachData} />
                })}
            </div>
        </>
    )
}