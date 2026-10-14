import { dbConnection } from "@/Backend/lib/dbConnection";
import { OrderItem, OrderModel } from "@/Backend/models/order.model";
import { Product, ProductModel } from "@/Backend/models/product.model";
import { HttpError } from "@/Backend/lib/errors";
import { GetCurrentAccount } from "@/Backend/services/CurrentAccount";
import z from "zod";
import {
    NAME_MESSAGE,
    NAME_PATTERN,
    PERSONAL_INFO_MAX_LENGTH as MAX,
    PHONE_MESSAGE,
    PHONE_PATTERN,
    hasEnoughPhoneDigits,
} from "@/Backend/lib/personalInfoRules";

export type CreateOrderPayload = {
    items: Product[];
    userPersonalInfo: unknown; // type this properly once you have a shape for it
}



// Limits and patterns live in Backend/lib/personalInfoRules.ts (shared with the browser check and the form inputs).
// Exported so a test can check this schema against the browser check.
export const personalInfoSchema = z.object({
    firstname: z.string().trim().min(1).max(MAX.firstname).regex(NAME_PATTERN, NAME_MESSAGE),
    lastname: z.string().trim().min(1).max(MAX.lastname).regex(NAME_PATTERN, NAME_MESSAGE),
    gender: z.string().max(MAX.gender),
    cityNprovince: z.string().trim().min(1).max(MAX.cityNprovince),
    district: z.string().trim().min(1).max(MAX.district),
    commune: z.string().trim().min(1).max(MAX.commune),
    street: z.string().trim().min(1).max(MAX.street),
    telephone: z.string().trim().regex(PHONE_PATTERN, PHONE_MESSAGE).refine(hasEnoughPhoneDigits, PHONE_MESSAGE),
    email: z.email().max(MAX.email),
});

async function GetRealProducts(items: Product[]) {
    const ids = items.map((item) => item._id);
    //prevent N+1 look up to db
    const products:Product[] = await ProductModel.find({ _id: { $in: ids } });
    
    return new Map(products.map((p) => [p._id.toString(), p]));
}

// Everything both ways of ordering (the old "place order" and the ABA QR payment) must do first:
// check the delivery details, find out who is signed in, and take every price from the database (never from the browser).
export async function PrepareOrder({items, userPersonalInfo:rawPersonalInfo}:CreateOrderPayload) {
    //userPersonalInfo:rawPersonalInfo this part is renaming userPersonalInfo to get a local variable for using with zod, to prevent changing userPersonalInfo at multiple place
    const checked = personalInfoSchema.safeParse(rawPersonalInfo);
    if(!checked.success){
        throw new HttpError("Please complete your delivery details and cart", 400);
    }
    const userPersonalInfo = checked.data;
    await dbConnection();

    const { accountId, cookiesData } = await GetCurrentAccount();
    const productMap = await GetRealProducts(items);

    const orderItems: OrderItem[] = items.map((item: Product) => {
        const product = productMap.get(item._id.toString());
        if (product === undefined) {
            throw new HttpError(`Product ${item._id} not found`, 404);
        }
        return {
            productId: item._id,
            priceAtPurchase: product.price,
        };
    });

    return { accountId, userPersonalInfo, cookiesData, orderItems, productMap };
}

export async function CreateOrder(payload:CreateOrderPayload) {
    const { accountId, userPersonalInfo, cookiesData, orderItems } = await PrepareOrder(payload);

    const orderData = await OrderModel.create({accountId, userPersonalInfo, orderItems})
    return { items: payload.items, userPersonalInfo, cookiesData, orderItems, orderId: orderData._id.toString(), createdAt: orderData.createdAt };

}
