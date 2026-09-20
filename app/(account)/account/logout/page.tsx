"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Logout() {
    const route = useRouter();

    const onConfirm = async ()=> {
        const req = await fetch("/api/logout", {
            method: "POST"
        });
        if(req.ok){
            route.push("/")
            route.refresh();
        }
    }
    return (
        <div
        className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-heading"
        >
        <article className="w-full max-w-sm mx-4 rounded-xl bg-white text-black shadow-xl p-6">
            <h1 id="logout-heading" className="text-lg font-semibold text-center">
            Are you sure you want to log out?
            </h1>

            <div className="mt-6 flex gap-3">
            <Link
                href="/account"
                className="btn flex-1 rounded-lg border text-black bg-white border-black/10 py-2 font-medium hover:bg-black/5 transition-colors"
            >
                Stay signed in
            </Link>
            <a
                onClick={onConfirm}
                className="btn flex-1 py-2 transition-colors"
            >
                Log out
            </a>
            </div>
        </article>
        </div>
    );
}
