import { dbConnection } from "@/Backend/lib/dbConnection";
import { ProductModel } from "@/Backend/models/product.model";
import { connection } from "next/server";


import { cacheLife, cacheTag } from 'next/cache';

export async function GetProductDetail() {
    'use cache';
    cacheLife('weeks');
    cacheTag('product-detail');

    const start = Date.now(); // This line and the console.log use to test cache
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
        .sort({name: 1})
        .lean();

        console.log('DB query took:', Date.now() - start, 'ms'); //This console.log

    return JSON.parse(JSON.stringify(products));
}

export async function GetPrice(_id: string[]) {
    // no 'use cache' — always fresh
    await connection();
    const start = Date.now();// This line and the console.log use to test cache
    await dbConnection();
    const price:{_id: string, price: number}[] = await ProductModel.find({_id: _id})
    .select('price')
    .sort({price: -1})
    .lean();
    console.log('DB query took:', Date.now() - start, 'ms');//This console.log
    return JSON.parse(JSON.stringify(price));
}