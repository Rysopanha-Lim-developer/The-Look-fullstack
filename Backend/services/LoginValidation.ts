import { dbConnection } from "@/Backend/lib/dbConnection";
import { User, UserModel } from "@/Backend/models/user.model";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";


type LoginPayload = {
    username: string;
    email: string;
    password: string;
}

export async function LoginValidation({ username, email, password }: LoginPayload) {
    await dbConnection();
    const userReference:User = await UserModel.findOne({email}).lean();
    if (!userReference) {
        throw new HttpError("Email not found", 422);
    }
    if (username !== userReference.username) {
        throw new HttpError("Username not found", 422);
    }
    //This compare the incoming password and the one in the db
    const isUser = await bcrypt.compare(password, userReference.password)
    if (!isUser) {
        throw new HttpError("Incorrect password", 422);
    }

    const cookie = await cookies();

    cookie.set('session', JSON.stringify({ username: username, email: email }), {
        httpOnly: true,      // JS on the client can't read it (XSS protection)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', //path specify which url of the web can access this cookies if use /account only this url has access to the cookies other don't
        maxAge: 60 * 60 * 24 * 30, // 30 days max life
    });

    return { message: "Successfully login" };
}