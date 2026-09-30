import { Suspense } from "react";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { UserPersonalDataForm } from "@/Frontend/components/user/UserPersonalDataForm/UserPersonalDataForm";
import { cookies } from "next/headers";
import { verifyAccessToken, jwtPayload } from "@/Backend/lib/jwt";

export default function UserProfilePage(){

    return(
        <Suspense fallback={<LoadingBar />}>
            <UserProfile />
        </Suspense>
    )
}

async function UserProfile(){
    const session = await cookies();
    const token = session.get("access_token")?.value;
    const payload: jwtPayload = await verifyAccessToken(token!);

    return(
        <>
            <article className="flex flex-col w-full">
                <h2 className="my-0 underline">Welcome back {payload.username}</h2>
                <h3 className="my-0">Email: {payload.email}</h3>
            </article>
            <article className="flex flex-col w-full pt-2.5">
                <UserPersonalDataForm />
            </article>
        </>
    )
}