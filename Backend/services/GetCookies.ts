import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GetCookies() {
    try {
        const cookiesSession = await cookies();
        const cookiesString = cookiesSession.get("session");
        if(!cookiesString){
            throw new Error("Pleas login to your account before purchase.")
        };
        const cookiesData:{username: string, email:string} = JSON.parse(cookiesString.value)
        return NextResponse.json(cookiesData)
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
}