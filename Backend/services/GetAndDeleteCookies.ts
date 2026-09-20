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

export async function DeleteCookies() {
    const cookiesSession = await cookies();
    const cookiesString = cookiesSession.delete("session");
    if(!cookiesString){
        throw new HttpError("There is no current session available.", 401)
    };
    return  { message: "Successfully sign out" }
}