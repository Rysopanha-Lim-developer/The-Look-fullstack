import { Suspense } from "react";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { UserPersonalDataForm } from "@/Frontend/components/user/UserPersonalDataForm/UserPersonalDataForm";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation"; //work the same as useRouter but for server component
import { verifyAccessToken } from "@/Backend/lib/jwt";

export default function UserProfilePage(){

    return(
        <Suspense fallback={<LoadingBar />}>
            <UserProfile />
        </Suspense>
    )
}

async function UserProfile(){
    await connection();
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        redirect('/login');
    }

    let payload;
    try {
        payload = await verifyAccessToken(token);
    } catch {
        redirect("/login");
    }
    

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