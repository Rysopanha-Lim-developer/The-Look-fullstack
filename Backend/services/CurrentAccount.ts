import { cookies } from "next/headers";
import { dbConnection } from "@/Backend/lib/dbConnection";
import { HttpError } from "@/Backend/lib/errors";
import { jwtPayload, verifyAccessToken } from "@/Backend/lib/jwt";
import { UserModel, User } from "@/Backend/models/user.model";

// Who is signed in? Reads the access_token cookie and finds the account.
// Anything wrong with the session is a 401 (not a 500), so the page can say "sign in again".
export async function GetCurrentAccount() {
    await dbConnection();

    const cookiesSession = await cookies();
    const token = cookiesSession.get("access_token")?.value;
    if (!token) {
        throw new HttpError("Please sign in to your account first.", 401);
    }

    let payload: jwtPayload;
    try {
        payload = await verifyAccessToken(token);
    } catch {
        throw new HttpError("Your session has expired. Please sign in again.", 401);
    }

    const userAccount: User | null = await UserModel.findOne({ username: payload.username }).lean();
    if (!userAccount) {
        throw new HttpError("Cannot find your account.", 401);
    }

    return {
        accountId: userAccount._id as string,
        cookiesData: { username: payload.username, email: payload.email },
    };
}
