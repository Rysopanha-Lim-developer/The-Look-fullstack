import { NextRequest, NextResponse } from "next/server";
import { GetPaywayStatus } from "@/Backend/services/GetPaywayStatus";
import { routeError } from "@/Backend/lib/routeError";

// The payment page polls this: /api/payway/status?orderId=...
export async function GET(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get("orderId") ?? "";
        const result = await GetPaywayStatus(orderId);
        return NextResponse.json(result, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        return routeError(error, "payway-status");
    }
}
