import { NextRequest, NextResponse } from "next/server";
import { User, UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";

export async function CreateNewUser(request:NextRequest) {
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
        await dbConnection();
        const existedUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }]
        });
        if (existedUser) {
            if (existedUser.username === username) {
                return NextResponse.json(
                    {
                        message: `Username already existed. Please choose another username.`,
                        status: 403
                    }
            );
            }
            if (existedUser.email === email as string) {
                return NextResponse.json(
                    {
                        message: `Email has been used. Please use another email.`,
                        status: 403
                    }
                );
            }
        }
        await UserModel.create({username, email, password});

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
