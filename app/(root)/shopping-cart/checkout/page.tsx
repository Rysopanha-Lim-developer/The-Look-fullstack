"use client"
    
import { useState, useEffect } from "react";
import { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";
import OrderReceipt from "@/Frontend/components/product/Receipt/OrderReceipt";
import OrderReceiptSkeleton from "@/Frontend/components/common/RecieptSkeleton/OrderReceiptSkeleton";
import { useCart } from "@/Frontend/hooks/CartContext";

export default function Checkout(){
    // this state and useEffect is for getting data from local storage and sent to the api
    const {items} = useCart();
    let [userPersonalInfo, setUserPersonalInfo] = useState<UserPersonalInfo | null>(null)
    let [cookiesData, setCookiesData] = useState<{username: string, email:string} | null> (null)
    let [loading, setLoading] = useState(true);
    let [apiStatus, setApiStatus] = useState(0);



    useEffect(() => {
        const userPersonalInfo:UserPersonalInfo = JSON.parse(localStorage.getItem("personal-data")?? "{}")
        setUserPersonalInfo(userPersonalInfo)
    },[])

    useEffect(() => {
        async function GetCookies(){
            try {
                const req = await fetch("/api/order", {
                    method: "GET",
                });
                const res = await req.json();
                setCookiesData(res)
            } catch (error) {
                console.error(error)
            }
            finally{
                setLoading(false)
            }
        };
        GetCookies();
    }, []);

    async function SendOrder(){
        try {
            const req = await fetch("/api/order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({items, userPersonalInfo})
            });
            const res = await req.json();
            if(!req.ok){
                throw new Error(`Cannot create order ${req.status}`);
            };

            setApiStatus(req.status);
            setCookiesData(res.cookiesData);
            setUserPersonalInfo(res.userPersonalInfo);
        } catch (error) {
            console.error(error);
        }
    }
    if(loading){
        return <OrderReceiptSkeleton />
    }
    return(
        <>
        <section className="w-full flex items-center justify-center">
            <article className="w-max flex flex-col items-center justify-center">
                {userPersonalInfo && cookiesData && (
                <OrderReceipt
                    cartData={items}
                    cookiesData={cookiesData}
                    userPersonalInfo={userPersonalInfo}
                />
                )}
                <div className="w-full flex items-center justify-end">
                    <button type="button" className="btn" onClick={SendOrder}>Place Order</button>
                </div>
            </article>
        </section>
        
        </>
    )
}