import { CreateOrder } from "@/Backend/services/CreateOrder";
import { GetCookies } from "@/Backend/services/GetCookies";
import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "@/Backend/lib/errors";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await CreateOrder(body);
        return NextResponse.json(result, { status: 202 });
    } catch (error: any) {
        if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
        }
        return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 }
        );
    }
}


export async function GET(){
    return GetCookies()
}