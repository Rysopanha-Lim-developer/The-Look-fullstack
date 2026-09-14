import { dbConnection } from "@/Backend/lib/dbConnection";
import { User, UserModel } from "@/Backend/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import z from "zod";

export async function LoginValidation(request:NextRequest) {
    const {username, email, password} = await request.json();
    try {
        await dbConnection();
        const userReference:User = await UserModel.findOne({email}).lean();
        if(!userReference){
            throw new Error("Email not found");
        }

        //This compare the incoming password and the one in the db
        const isUser = await bcrypt.compare(password, userReference.password)
        if (username !== userReference.username) {
            return NextResponse.json({ message: "Username not found", status: 422 });
        }

        if (!isUser) {
            return NextResponse.json({ message: "Incorrect password", status: 422 });
        }

        const cookie = await cookies();

        cookie.set('session', JSON.stringify({ username: username, email: email }), {
            httpOnly: true,      // JS on the client can't read it (XSS protection)
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', //path specify which url of the web can access this cookies if use /account only this url has access to the cookies other don't
            maxAge: 60 * 60 * 24 * 30, // 30 days max life
        });

        return NextResponse.json({ message: "Successfully login", status: 200 });
    } catch (error:any) {
        return NextResponse.json({
                message : error.message || "something went wrong",
                staus : 422
            })
    }
}