import { dbConnection } from "@/Backend/lib/dbConnection";
import { OrderItem, OrderModel } from "@/Backend/models/order.model";
import { UserModel, User } from "@/Backend/models/user.model";
import { Product, ProductModel } from "@/Backend/models/product.model";
import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";
import { jwtPayload, verifyAccessToken } from "@/Backend/lib/jwt";
import z from "zod";

type CreateOrderPayload = {
    items: Product[];
    userPersonalInfo: unknown; // type this properly once you have a shape for it
}



const personalInfoSchema = z.object({
    firstname: z.string().trim().min(1).max(50),
    lastname: z.string().trim().min(1).max(50),
    gender: z.string().max(10),
    cityNprovince: z.string().trim().min(1).max(100),
    district: z.string().trim().min(1).max(100),
    commune: z.string().trim().min(1).max(100),
    street: z.string().trim().min(1).max(200),
    telephone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Invalid phone number"),
    email: z.email(),
});

async function GetRealPrices(items: Product[]) {
    const ids = items.map((item) => item._id);
    //prevent N+1 look up to db
    const products:Product[] = await ProductModel.find({ _id: { $in: ids } });
    
    const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));
    return priceMap;
}

export async function CreateOrder({items, userPersonalInfo:rawPersonalInfo}:CreateOrderPayload) {
    //userPersonalInfo:rawPersonalInfo this part is renaming userPersonalInfo to get a local variable for using with zod, to prevent changing userPersonalInfo at multiple place
    const checked = personalInfoSchema.safeParse(rawPersonalInfo);
    if(!checked.success){
        throw new HttpError("Please complete your delivery details and cart", 400);
    }
    const userPersonalInfo = checked.data;
    await dbConnection();

    const cookiesSession = await cookies();
    const token = cookiesSession.get("access_token")!.value;
    if(!token){
        throw new HttpError("Pleas login to your account before purchase.", 500)
    };
    const payload: jwtPayload= await verifyAccessToken(token)
    
    const cookiesData:{username: string, email:string} = {
        username : payload.username,
        email : payload.email
    }

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
    return { items, userPersonalInfo, cookiesData, orderItems, orderId: orderData._id.toString(), createdAt: orderData.createdAt };

}
