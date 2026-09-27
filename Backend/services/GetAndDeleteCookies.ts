import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";
import { jwtPayload, verifyAccessToken } from "@/Backend/lib/jwt";

export async function GetCookies() {
    const cookiesSession = await cookies();
    const token = cookiesSession.get("access_token")!.value;
    if(!token){
            throw new HttpError("Pleas login to your account before purchase.", 401)
        };
    const payload: jwtPayload= await verifyAccessToken(token)
    
    const cookiesData:{username: string, email:string} = {
        username : payload.username,
        email : payload.email
    }
    return cookiesData
}

export async function DeleteCookies() {
    const cookiesSession = await cookies();
    const cookiesString = cookiesSession.delete("access_token");
    if(!cookiesString){
        throw new HttpError("There is no current session available.", 401)
    };
    return  { message: "Successfully sign out" }
}