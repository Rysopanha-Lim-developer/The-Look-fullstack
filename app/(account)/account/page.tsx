import { Suspense } from "react";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { UserPersonalDataForm } from "@/Frontend/components/user/UserPersonalDataForm/UserPersonalDataForm";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation"; //work the same as useRouter but for server component

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
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);

    return(
        <>
            <article className="flex flex-col w-full">
                <h2 className="my-0 underline">Welcome back {session.username}</h2>
                <h3 className="my-0">Email: {session.email}</h3>
            </article>
            <article className="flex flex-col w-full pt-2.5">
                <UserPersonalDataForm />
            </article>
        </>
    )
}