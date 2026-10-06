// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/Backend/lib/jwt";
import { UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";

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
        await dbConnection(); // the proxy can run in its own process, and bufferCommands is false, so connect before querying
        const credentials = await UserModel.findById(validRefreshToken.sub).lean();
        if (!credentials) throw new Error("user not found");

        const newToken = await signAccessToken({
        sub: credentials._id!.toString(),
        username: credentials.username,
        email: credentials.email,
        });

        // Give the page the NEW token too. Without this, the page still reads the old request cookies,
        // finds no access_token and redirects to /login even though the refresh worked.
        const cookieHeader = req.cookies.getAll()
            .filter(cookie => cookie.name !== "access_token")
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .concat(`access_token=${newToken}`)
            .join("; ");
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("cookie", cookieHeader);

        const res = NextResponse.next({ request: { headers: requestHeaders } });
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
    matcher: ["/account/:path*", "/shopping-cart/checkout"],
};