import { dbConnection } from "../lib/dbConnection";
import { User, UserModel } from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function loginValidation(request:NextRequest) {
    const {username, email, password} = await request.json();
    try {
        await dbConnection();
        const userReference:User = await UserModel.findOne({email}).lean();
        if(!userReference){
            throw new Error("Email not found");
        }

        //This compare the incoming password and the one in the db
        const isUser = await bcrypt.compare(password, userReference.password)
        if(username != userReference.username){
            return NextResponse.json({
                message : "Username not found",
                staus : 422
            })
        }else{
            if(!isUser){
                return NextResponse.json(
                    {
                        message : "Incorrect password",
                        status: 422
                    }
                )
            }
            else{
                return NextResponse.json({message : "Successfully login", status: 200})
            }
        }
    } catch (error:any) {
        return NextResponse.json({
                message : error.message || "something went wrong",
                staus : 422
            })
    }
}