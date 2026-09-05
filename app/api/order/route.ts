import { createOrder } from "@/app/services/createOrder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const {cartData} = await request.json();
        return NextResponse.json(cartData)
    // return createOrder(request);
    }catch(error:any){
        return NextResponse.json(error.message)
    }
}