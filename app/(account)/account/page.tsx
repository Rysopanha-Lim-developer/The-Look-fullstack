import { User, UserModel } from "@/app/models/user.model";
import { dbConnection } from "@/app/lib/dbConnection";
import { Suspense } from "react";
import { connection } from "next/server";
import LoadingBar from "@/app/components/LoadingBar/LoadingBar";
import { UserPersonalDataForm } from "@/app/components/UserPersonalDataForm/UserPersonalDataForm";

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
            <article className="flex flex-col w-full">
                <h2 className="my-0 underline">Welcome back {userInfo.username}</h2>
                <h3 className="my-0">Email: {userInfo.email}</h3>
            </article>
            <article className="flex flex-col w-full pt-2.5">
                <UserPersonalDataForm />
            </article>
        </>
    )
}