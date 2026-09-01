import { User, UserModel } from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { loginValidation } from "@/app/services/loginValidation";

export async function POST(request:NextRequest, params:any) {
    return loginValidation(request);
}