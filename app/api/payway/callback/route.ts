import { NextRequest, NextResponse } from "next/server";
import { ConfirmPaywayPayment } from "@/Backend/services/ConfirmPaywayPayment";
import { routeError } from "@/Backend/lib/routeError";

// PayWay calls this when someone pays (only works once the bank has whitelisted the domain and PAYWAY_USE_CALLBACK=true).
//
// The body is NOT trusted. We only read the transaction id from it, then ask PayWay (Check Transaction API)
// what really happened, exactly as PayWay's docs require. So a faked request can at most trigger a harmless check.
// TODO once the bank confirms the signature header name: also verify PayWay's HMAC signature here.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        const tranId = typeof body?.tran_id === "string" ? body.tran_id : "";
        if (!/^[A-Za-z0-9_-]{1,40}$/.test(tranId)) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        const outcome = await ConfirmPaywayPayment(tranId);
        console.log(`[payway-callback] ${tranId}: ${outcome}`);
        // 200 also for unknown ids, so the answer does not reveal which transaction ids exist
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        // a 5xx lets PayWay retry later
        return routeError(error, "payway-callback");
    }
}
