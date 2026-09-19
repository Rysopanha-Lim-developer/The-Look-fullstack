import { dbConnection } from "@/Backend/lib/dbConnection";
import { OrderItem, OrderModel } from "@/Backend/models/order.model";
import { UserModel, User } from "@/Backend/models/user.model";
import { Product, ProductModel } from "@/Backend/models/product.model";
import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";

type CreateOrderPayload = {
    items: Product[];
    userPersonalInfo: unknown; // type this properly once you have a shape for it
}

async function GetRealPrices(items: Product[]) {
    const ids = items.map((item) => item._id);
    //prevent N+1 look up to db
    const products:Product[] = await ProductModel.find({ _id: { $in: ids } });
    
    const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));
    return priceMap;
}

export async function CreateOrder({items, userPersonalInfo}:CreateOrderPayload) {
    await dbConnection();

    const cookiesSession = await cookies();
    const cookiesString = cookiesSession.get("session");
    if(!cookiesString){
        throw new HttpError("Please login to your account before purchase.", 401);
    };
    const cookiesData:{username: string, email:string} = JSON.parse(cookiesString.value)

    const userAccount:User = await UserModel.findOne({"username": cookiesData.username}).lean()
    if(!userAccount){
        throw new HttpError("Cannot find your account.", 401);
    }

    const accountId = userAccount._id
    const priceMap = await GetRealPrices(items);

    const orderItems: OrderItem[] = items.map((item: Product) => {
        const priceAtPurchase = priceMap.get(item._id.toString());
        if (priceAtPurchase === undefined) {
            throw new HttpError(`Product ${item._id} not found`, 404);
        }
        return {
            productId: item._id,
            priceAtPurchase,
        };
    });
    

    const orderData = await OrderModel.create({accountId, userPersonalInfo, orderItems})
    return { items, userPersonalInfo, cookiesData, orderItems };
}
