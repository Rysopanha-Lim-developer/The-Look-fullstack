import { dbConnection } from "../lib/dbConnection";
import { OrderItem, OrderModel } from "../models/order.model";
import { UserModel, User } from "../models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function createOrder(request:NextRequest) {
    try {
        await dbConnection();
        const {cartData, userPersonalInfo} = await request.json();

        const cookiesSession = await cookies();
        const cookiesString = cookiesSession.get("session");
        if(!cookiesString){
            throw new Error("Pleas login to your account before purchase.")
        };
        const cookiesData:{username: string, email:string} = JSON.parse(cookiesString.value)

        const userAccount:User = await UserModel.findOne({"username": cookiesData.username}).lean()
        if(!userAccount){
            throw new Error("Cannot find your account.");
        }
        const accountId = userAccount._id
        const items:OrderItem[] = []
        cartData.forEach((item:any) => {
            let order:OrderItem = {     
                    productId: item._id,
                    priceAtPurchase: item.price,
            }
            items.push(order)
        });

        const orderData = await OrderModel.create({accountId, userPersonalInfo, items})
        return NextResponse.json({cartData, userPersonalInfo, cookiesData, items, status:202})
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
