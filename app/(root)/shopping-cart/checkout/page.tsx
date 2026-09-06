"use client"

import { Product } from "@/app/models/product.model";
import { useState, useEffect } from "react";
import { userPersonalInfo } from "@/app/lib/Types/generalTypes.module";

export default function Checkout(){
    // this state and useEffect is for getting data from local storage and sent to the api
    let [cartData, setCartData] = useState<Product[]>([]);
    let [userPersonalInfo, setUserPersonalInfo] = useState<userPersonalInfo | null>(null)
    let [cookiesData, setCookiesData] = useState<{username: string, email:string} | null> (null)


    useEffect(() => {
        const unfilteredData:[] = JSON.parse(localStorage.getItem("cart-items")?? "[]")
        // the ?? will return the value of its right side if the left side is null or undefind

        const filteredData = unfilteredData.filter((item:any, index:any, self:any) => 
            index === self.findIndex((t:any) => t._id === item._id)
        );

        setCartData(filteredData)
        localStorage.setItem("cart-items", JSON.stringify(filteredData))
    }, [])

    useEffect(() => {
        const userPersonalInfo:userPersonalInfo = JSON.parse(localStorage.getItem("personal-data")?? "{}")
        setUserPersonalInfo(userPersonalInfo)
    },[])

    async function sendOrder(){
        //The body need more in 1.username&email
        try {
            const req = await fetch("/api/order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cartData, userPersonalInfo})
            });
            const res = await req.json();
            if(res.status !== 202){
                throw new Error("Cannot create order");
            };

            setCookiesData(res.cookiesData)
            setCartData(res.cartData)
            setUserPersonalInfo(res.userPersonalInfo)

            console.table(res.items)
        } catch (error) {
            console.error(error)
        }
    }
    return(
        <>
        <h1 className="print:hidden" onClick={sendOrder}>checkout</h1>
        <h2 className="w-full text-center">Recipe</h2>
        <div>
            <p>{cookiesData?.username}</p>
            <p>{cookiesData?.email}</p>
            <p>{userPersonalInfo?.firstname}</p>
            <p>{userPersonalInfo?.lastname}</p>
            <p>{userPersonalInfo?.gender}</p>
            <p>{userPersonalInfo?.cityNprovince}</p>
            <p>{userPersonalInfo?.district}</p>
            <p>{userPersonalInfo?.communce}</p>
            <p>{userPersonalInfo?.telephone}</p>
            {cartData.map((e) => {
                return <p>{e.name}</p>
            })}
        </div>
        </>
    )
}