// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/Backend/lib/jwt";
import { UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";

// What to do when nobody is signed in. Account pages send people to /login from here.
// Checkout does NOT redirect from here: the browser also runs this file for <Link> prefetches and keeps a redirect for a
// few minutes, so after signing in the Checkout button kept sending people back to /login. The checkout page checks the
// session itself and sends signed-out people to /login?next=... (see checkout/page.tsx).
// Checkout is still listed in the matcher so an expired access token is silently renewed below, as before.
function signedOut(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/account")) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
}

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
        return signedOut(req);
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
        return signedOut(req);
    }
}

export const config = {
    matcher: ["/account/:path*", "/shopping-cart/checkout"],
};