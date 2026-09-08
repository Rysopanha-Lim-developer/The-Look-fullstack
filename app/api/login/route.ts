import { NextRequest } from "next/server";
import { LoginValidation } from "@/Backend/services/LoginValidation";

export async function POST(request:NextRequest, params:any) {
    return LoginValidation(request);
}