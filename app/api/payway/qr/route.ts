import { NextRequest, NextResponse } from "next/server";
import { CreatePaywayPayment } from "@/Backend/services/CreatePaywayPayment";
import { routeError } from "@/Backend/lib/routeError";

// Checkout calls this: creates a pending order and an ABA KHQR code for it.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await CreatePaywayPayment(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return routeError(error, "payway-qr");
    }
}
