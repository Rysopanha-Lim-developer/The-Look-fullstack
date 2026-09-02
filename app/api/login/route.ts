import { NextRequest } from "next/server";
import { loginValidation } from "@/app/services/loginValidation";
import { getUserInfoForAccount } from "@/app/services/getUserInfoForAccount";

export async function POST(request:NextRequest, params:any) {
    return loginValidation(request);
}

export async function GET(request:NextRequest, params:any) {
    return getUserInfoForAccount();
}