import { Suspense } from "react";
import LoadingBar from "@/Frontend/components/common/LoadingBar/LoadingBar";
import { UserPersonalDataForm } from "@/Frontend/components/user/UserPersonalDataForm/UserPersonalDataForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

    // Not signed in (or the session has expired): go to the login page instead of showing an error
    let payload: jwtPayload | null = null;
    if (token) {
        try {
            payload = await verifyAccessToken(token);
        } catch {
            payload = null;
        }
    }
    if (!payload) redirect("/login");

    return(
        <>
            <h1 className="m-0 text-[1.75rem] font-medium leading-tight">Hi, {payload.username}</h1>
            <p className="m-0 mt-0.5 text-sm text-muted">{payload.email}</p>

            <h2 className="m-0 mb-4 mt-6 text-base font-medium">Delivery details</h2>
            {/* useSearchParams (inside the form) needs its own Suspense boundary */}
            <Suspense fallback={null}>
                <UserPersonalDataForm />
            </Suspense>
        </>
    )
}
