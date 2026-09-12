import { dbConnection } from "@/Backend/lib/dbConnection";
import { ProductModel } from "@/Backend/models/product.model";
import { connection } from "next/server";


import { cacheLife, cacheTag } from 'next/cache';

export async function GetProductDetail() {
    'use cache';
    cacheLife('weeks');
    cacheTag('product-detail');

    
    await dbConnection();
    const products:{
        _id: string
        brand: string,
        name: string,
        color: string,
        material: string,
        image: string,
        slug: string,
    }[] = await ProductModel.find({})
        .select('brand name color material image slug')
        .sort({price: -1})
        .lean();


    return JSON.parse(JSON.stringify(products));
}

export async function GetPrice(_id: string[]) {
    // no 'use cache' — always fresh
    await connection();
    await dbConnection();
    const price:{_id: string, price: number}[] = await ProductModel.find({_id: _id})
    .select('price')
    .sort({price: -1})
    .lean();

    return JSON.parse(JSON.stringify(price));
}