import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { LoginANDRegesterPayload } from "@/Backend/services/LoginValidation";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}
const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET)


export async function signAccessToken(payload: LoginANDRegesterPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "15m")
        .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify<LoginANDRegesterPayload>(token, JWT_SECRET);
    return payload;
}

