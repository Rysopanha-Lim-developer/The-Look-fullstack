import { dbConnection } from "@/Backend/lib/dbConnection";
import { OrderItem, OrderModel } from "@/Backend/models/order.model";
import { UserModel, User } from "@/Backend/models/user.model";
import { Product, ProductModel } from "@/Backend/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function CreateOrder(request:NextRequest) {
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
        
        async function GetRealPrices(items: Product[]) {
            const ids = items.map((item) => item._id);
            //prevent N+1 look up to db
            const products:Product[] = await ProductModel.find({ _id: { $in: ids } });
            
            const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));
            return priceMap;
        }

        const priceMap = await GetRealPrices(cartData);

        const items: OrderItem[] = cartData.map((item: Product) => {
            const priceAtPurchase = priceMap.get(item._id.toString());
            if (priceAtPurchase === undefined) {
                throw new Error(`Product ${item._id} not found`);
            }
            return {
                productId: item._id,
                priceAtPurchase,
            };
        });
        

        const orderData = await OrderModel.create({accountId, userPersonalInfo, items})
        return NextResponse.json({cartData, userPersonalInfo, cookiesData, items},{status:202})
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
