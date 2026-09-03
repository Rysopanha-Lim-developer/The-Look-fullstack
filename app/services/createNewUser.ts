"use server"

import { NextRequest, NextResponse } from "next/server";
import { User, UserModel } from "../models/user.model";
import { dbConnection } from "../lib/dbConnection";

export async function createNewUser(request:NextRequest) {
    try{
        const {username, email, password} = await request.json();

        if(
            !username || !email || !password ||
            username == " " || email == " " || password == " "
        ){
            return NextResponse.json(
                { 
                    message: "Please fill out the required Information",
                    status: 400
                }

            ); 
        }
        await dbConnection()
        await UserModel.create({username, email, password})

        return NextResponse.json(
            { 
                message: "Registered successfully",
                status: 201
            },
        ); 
    }catch (error: any) {
        return NextResponse.json(
        { 
            error: error.message || "Something went wrong",
            status: 500
        },
        );
    }
}
