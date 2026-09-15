import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";
import z from "zod";

export const registerSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters").max(12, "Username must be at most 12 characters"),
    email: z.email(),
    password: z.string().min(4, "Password must be at least 4 characters").max(8, "Password must be at most 8 characters"),
});


export async function CreateNewUser(request:NextRequest) {
    try{
        const body = await request.json();

        const checkedInput = registerSchema.safeParse(body)
        if (!checkedInput.success) {
            return NextResponse.json(
                { message: "Please check your input" },
                {status: 400}
            );
        }
        const {username, email, password} = checkedInput.data;

        await dbConnection();
        const existedUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }]
        });
        if (existedUser) {
            if (existedUser.username === username) {
                return NextResponse.json(
                    {
                        message: `Username already existed. Please choose another username.`
                    },
                    { status: 403 }
            );
            }
            if (existedUser.email === email as string) {
                return NextResponse.json(
                    {
                        message: `Email has been used. Please use another email.`
                    },
                    { status: 403 }
                );
            }
        }
        await UserModel.create({username, email, password});

        return NextResponse.json(
            { 
                message: "Registered successfully"
            },
            {
                status: 201
            }
        ); 
    }catch (error: any) {
        return NextResponse.json(
        { 
            error: error.message || "Something went wrong"
        },
        {
            status: 500
        }
        );
    }
}
