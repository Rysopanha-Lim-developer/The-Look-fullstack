import { cookies } from "next/headers";
import { HttpError } from "@/Backend/lib/errors";

export async function GetCookies() {
    const cookiesSession = await cookies();
    const cookiesString = cookiesSession.get("session");
    if(!cookiesString){
        throw new HttpError("Pleas login to your account before purchase.", 401)
    };
    const cookiesData:{username: string, email:string} = JSON.parse(cookiesString.value)
    return cookiesData
}