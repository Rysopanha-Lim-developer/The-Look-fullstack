"use client"

import DisplayCard from "@/app/components/product/DisplayCard/DisplayCard";
import { Product } from "@/app/models/product.model";
import { useEffect, useState } from "react";

export default function CartPage(){
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

    async function sendOrder(){
        const req = await fetch("/api/order", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({cartData})
        })
        const res = await req.json()
        console.table(res)
    }

    return(
        <>
            <div className="flex w-full items-center justify-between px-5">
                <h1>My Cart</h1>
                <button className="btn" onClick={sendOrder}>Checkout Here</button>
            </div>
            <div className="w-full grid grid-cols-4 gap-4 px-2.5">
                {cartData.map((eachData:Product) => {
                    return <DisplayCard key={eachData.slug} data={eachData} />
                })}
            </div>
        </>
    )
}