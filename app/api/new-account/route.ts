import { CreateNewUser } from "@/Backend/services/CreateNewUser";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest, {params}:any){
    
    return await CreateNewUser(request);
}