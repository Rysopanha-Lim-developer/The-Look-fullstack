import { dbConnection } from "@/Backend/lib/dbConnection"
import { OrderModel, Order } from "@/Backend/models/order.model"
import { User, UserModel } from "@/Backend/models/user.model";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { connection } from "next/server";
import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import OrderDisplayCard from "@/Frontend/components/product/OrderDisplayCard/OrderDisplayCard";
import { verifyAccessToken } from "@/Backend/lib/jwt";
import { jwtPayload } from "@/Backend/lib/jwt";

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
    const token = cookiesSession.get("access_token")!.value;
    if(!token){
        throw new Error("Pleas login to your account before purchase.")
    };
    const payload: jwtPayload= await verifyAccessToken(token)
    const user:User = await UserModel.findOne({username: payload.username}).lean()

    const res = await OrderModel.find({accountId: user._id}).lean();
    const orders:Order[] = JSON.parse(JSON.stringify(res)); 
    // newest first (done here so the database query stays as it was)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (orders.length === 0) {
        return(
            <div className="flex flex-col items-center py-12 text-center">
                <h1 className="m-0 text-2xl font-medium">No orders yet</h1>
                <p className="m-0 mt-2 text-sm text-muted">Orders you place will show up here.</p>
                <Link href="/" className="mt-6 flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background">
                    Keep shopping
                </Link>
            </div>
        )
    }

    return(
        <>
        <h1 className="m-0 text-[1.75rem] font-medium leading-tight">Orders</h1>
        <p className="m-0 mb-4 mt-0.5 text-sm text-muted">{orders.length} {orders.length === 1 ? "order" : "orders"}, newest first</p>

        <OrderDisplayCard props={orders}/>
        </>
    )
}