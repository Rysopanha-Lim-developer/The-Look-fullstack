import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";
import z from "zod";

export const registerSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters").max(12, "Username must be at most 12 characters"),
    email: z.email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(10, "Password must be at most 10 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


export async function CreateNewUser(request:NextRequest) {
    try{
        const body = await request.json();

        const checkedInput = registerSchema.safeParse(body)
        if (!checkedInput.success) {
            const { fieldErrors } = z.flattenError(checkedInput.error);
            const allMessages = Object.values(fieldErrors).flat(); //convert the obj above to array for display
            return NextResponse.json(
                { message: "Please check your input", errors: allMessages },
                { status: 400 }
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
            message: error.message || "Something went wrong"
        },
        {
            status: 500
        }
        );
    }
}
