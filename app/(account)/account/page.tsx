import { User, UserModel } from "@/app/models/user.model";
import { dbConnection } from "@/app/lib/dbConnection";
import { Suspense } from "react";
import { connection } from "next/server";
import LoadingBar from "@/app/components/LoadingBar/LoadingBar";

export default function UserProfilePage(){

    return(
        <Suspense fallback={<LoadingBar />}>
            <UserProfile />
        </Suspense>
    )
}

async function UserProfile(){
    await connection();
    await dbConnection();
    const userInfo:User = await UserModel.findOne({username: "Panha"}).lean();

    return(
        <>
        <h3 className="my-0">Welcome {userInfo.username}</h3>
        <h3 className="my-0">Email: {userInfo.email}</h3>
        </>
    )
}