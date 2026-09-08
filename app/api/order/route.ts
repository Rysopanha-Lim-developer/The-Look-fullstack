import { CreateOrder } from "@/Backend/services/CreateOrder";
import { GetCookies } from "@/Backend/services/GetCookies";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return CreateOrder(request)
}
export async function GET(){
    return GetCookies()
}