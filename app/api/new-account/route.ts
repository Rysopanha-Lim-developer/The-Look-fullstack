import { CreateNewUser } from "@/Backend/services/CreateNewUser";
import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "@/Backend/lib/errors";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await CreateNewUser(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        if (error instanceof HttpError) {
            return NextResponse.json(
                { message: error.message, ...(error.details as object || {}) },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}