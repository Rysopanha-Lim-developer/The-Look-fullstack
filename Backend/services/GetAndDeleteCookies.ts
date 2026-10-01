import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";
import { jwtPayload, verifyAccessToken } from "@/Backend/lib/jwt";

export async function GetCookies() {
    const cookiesSession = await cookies();
    const token = cookiesSession.get("access_token")!.value;
    const payload: jwtPayload= await verifyAccessToken(token)
    
    const cookiesData:{username: string, email:string} = {
        username : payload.username,
        email : payload.email
    }
    return cookiesData
}

export async function DeleteCookies() {
    const cookiesSession = await cookies();
    const accessToken = cookiesSession.delete("access_token");
    const refreshToken = cookiesSession.delete("refresh_token");
    if(!accessToken){
        throw new HttpError("There is no current session available.", 500)
    };
    return  { message: "Successfully sign out" }
}