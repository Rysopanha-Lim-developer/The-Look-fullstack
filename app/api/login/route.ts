import { NextRequest, NextResponse } from "next/server";
import { LoginValidation } from "@/Backend/services/LoginValidation";
import { HttpError } from "@/Backend/lib/errors";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await LoginValidation(body);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        if (error instanceof HttpError) {
            return NextResponse.json({ message: error.message }, { status: error.status });
        }
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 } // unexpected errors → 500, not 422
        );
    }
}