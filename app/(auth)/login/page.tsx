import { Suspense } from "react";
import LoginForm from "@/Frontend/components/auth/LoginForm";

export default function LoginPage(){
    // useSearchParams (inside the form) needs a Suspense boundary
    return(
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    )
}
