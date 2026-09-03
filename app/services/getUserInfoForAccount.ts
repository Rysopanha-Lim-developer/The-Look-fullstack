"use server"

import { UserModel, User } from "../models/user.model";
import { NextResponse } from "next/server";
import { dbConnection } from "../lib/dbConnection";

export async function getUserInfoForAccount() {
    try {
        await dbConnection();
        const userInfo = await UserModel.findOne({username: "Panha"}).lean();
        if(!userInfo){
            return NextResponse.json({
                message: "User not found",
                status: 404
            })
        }
        return NextResponse.json(userInfo);
    } catch (error:any) {
        return NextResponse.json({
            message: error.message || "User not found",
            status: 404
        })
    }
}