"use client"

import { Product } from "@/app/models/product.model";
import { useState, useEffect } from "react";
import { UserPersonalInfo } from "@/app/lib/Types/generalTypes.module";
import OrderReceipt from "@/app/components/product/Receipt/OrderReceipt";

export default function Checkout(){
    // this state and useEffect is for getting data from local storage and sent to the api
    let [cartData, setCartData] = useState<Product[]>([]);
    let [userPersonalInfo, setUserPersonalInfo] = useState<UserPersonalInfo | null>(null)
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
        const userPersonalInfo:UserPersonalInfo = JSON.parse(localStorage.getItem("personal-data")?? "{}")
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
        {userPersonalInfo && cookiesData && (
        <OrderReceipt
            cartData={cartData}
            cookiesData={cookiesData}
            userPersonalInfo={userPersonalInfo}
        />
        )}
        <button className="btn" onClick={sendOrder}>Put order</button>
        </>
    )
}