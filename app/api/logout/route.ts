import { NextResponse, NextRequest } from "next/server";
import { DeleteCookies } from "@/Backend/services/GetAndDeleteCookies";
import { HttpError } from "@/Backend/lib/errors";


export async function POST(){
    try{
        const result = await DeleteCookies();
        return NextResponse.json(result, { status: 200 });
    }catch(error:any){
        if (error instanceof HttpError) {
            return NextResponse.json({ message: error.message }, { status: error.status });
        }
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 } 
        );
    }
}