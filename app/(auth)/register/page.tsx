import { Suspense } from "react";
import RegisterForm from "@/Frontend/components/auth/RegisterForm";

export default function RegisterPage(){
    return(
        <Suspense fallback={null}>
            <RegisterForm />
        </Suspense>
    )
}
