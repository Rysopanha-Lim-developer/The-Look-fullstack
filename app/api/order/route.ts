import { createOrder } from "@/app/services/createOrder";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return createOrder(request)
}