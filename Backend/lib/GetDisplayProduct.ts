import { GetProductDetail, GetPrice } from "@/Backend/services/GetProductDetail";
import { Product } from "@/Backend/models/product.model";

export async function GetDisplayProduct(){
    //Get the detail and price of each product
    const detail = await GetProductDetail();
    const price:{_id: string, price: number}[] = await GetPrice(detail.map((p:Product) => p._id))

    //Create a key value map as reference
    const liveData = new Map(price.map((e:{_id: string, price: number}): [string, { _id: string; price: number }] => [e._id, e]))

    //Combine both array by matching there _id
    const products:Product[] = detail.map((eachDetail:Product) => ({
        ...eachDetail,
        price: liveData.get(eachDetail._id)?.price ?? null,
    }))

    return products
}