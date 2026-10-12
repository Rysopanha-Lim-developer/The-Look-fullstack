import { NextResponse } from "next/server";
import { HttpError } from "@/Backend/lib/errors";

// One place that turns an error into an HTTP answer for the payment routes.
// Expected problems (HttpError) keep their message and status. Anything else is logged in full
// (see the terminal, or Vercel > Logs) and the customer only gets a generic message.
export function routeError(error: unknown, label: string) {
    if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(`[${label}] unexpected error:`, error);
    return NextResponse.json({ message: "Something went wrong on our side." }, { status: 500 });
}
