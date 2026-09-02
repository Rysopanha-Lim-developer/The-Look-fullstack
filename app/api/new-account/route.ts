import { createNewUser } from "@/app/services/createNewUser";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest, {params}:any){
    
    return await createNewUser(request);
}