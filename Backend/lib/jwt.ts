import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}
const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET)

export type jwtPayload = {
    sub: string,
    username: string,
    email: string
}

//prep refresh token


export async function signAccessToken(payload: jwtPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "12h")
        .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify<jwtPayload>(token, JWT_SECRET);
    return payload;
}

export function HashCredential(username: string, email: string, password: string): string {
    const combined = JSON.stringify({ username, email, password }); 
    return createHash("sha256").update(combined).digest("hex"); // 64 hex chars, safely under bcrypt's 72-byte limit
}

