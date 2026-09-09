import { dbConnection } from "@/Backend/lib/dbConnection"
import { OrderModel, Order } from "@/Backend/models/order.model"
import { User, UserModel } from "@/Backend/models/user.model";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { connection } from "next/server";
import { Suspense } from "react";
import { cookies } from "next/headers";
import OrderDisplayCard from "@/Frontend/components/product/OrderDisplayCard/OrderDisplayCard";

export default async function OrderPage(){
    return(
        <Suspense fallback={<LoadingBar />} >
            <Orders />
        </Suspense>
    )
}

async function Orders(){
    //use the username from cookies to get ther _id of that username, user that _id to query and get all order the has accountId that is the same as that _id and use it for display
    await connection();
    await dbConnection();
    const cookiesSession = await cookies();
    const cookiesString = cookiesSession.get("session");
    if(!cookiesString){
        throw new Error("Pleas login to your account before purchase.")
    };
    const cookiesData:{username: string, email:string} = JSON.parse(cookiesString.value)
    const user:User = await UserModel.findOne({username: cookiesData.username}).lean()

    const res = await OrderModel.find({accountId: user._id}).lean();
    const orders:Order[] = JSON.parse(JSON.stringify(res)); 

    return(
        <>
        <h1>My Orders</h1>

        <OrderDisplayCard props={orders}/>
        </>
    )
}