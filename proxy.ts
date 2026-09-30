// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/Backend/lib/jwt";
import { UserModel } from "@/Backend/models/user.model";

export async function proxy(req: NextRequest) {
const token = req.cookies.get("access_token")?.value;
const refreshToken = req.cookies.get("refresh_token")?.value;

if (token) {
    try {
        await verifyAccessToken(token);
        return NextResponse.next(); // access token still valid, nothing to do
    } catch {
        // fall through to try refreshing
    }
}

if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
}

try {
    const validRefreshToken = await verifyRefreshToken(refreshToken);
    const credentials = await UserModel.findById(validRefreshToken.sub).lean();
    if (!credentials) throw new Error("user not found");

    const newToken = await signAccessToken({
    sub: credentials._id!.toString(),
    username: credentials.username,
    email: credentials.email,
    });

    const res = NextResponse.next(); // let the original request continue to the page
    res.cookies.set("access_token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
    });
    return res;
} catch {
    return NextResponse.redirect(new URL("/login", req.url));
}
}

export const config = {
    matcher: ["/account/:path*"],
};