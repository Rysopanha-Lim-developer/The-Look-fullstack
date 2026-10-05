"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState(false);

    // A native <dialog> keeps keyboard focus inside it and closes with the Esc key
    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    const stay = () => router.push("/account");

    async function logout() {
        if (submitting) return;
        setSubmitting(true);
        setFailed(false);
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (res.ok) {
                router.push("/");
                router.refresh();
                return;
            }
            setFailed(true);
        } catch {
            setFailed(true);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            onCancel={stay}
            aria-labelledby="logout-title"
            className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-background p-5 text-foreground backdrop:bg-black/40"
        >
            <h1 id="logout-title" className="m-0 text-lg font-medium">Log out?</h1>
            <p className="m-0 mt-2 text-sm text-muted">Are you sure you want to log out of your account?</p>
            <div role="alert" className="empty:hidden">
                {failed && <p className="m-0 mt-3 text-sm text-danger">We couldn&apos;t log you out. Please try again.</p>}
            </div>
            <button
                type="button"
                onClick={logout}
                disabled={submitting}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background disabled:opacity-60"
            >
                {submitting ? "Logging out..." : "Log out"}
            </button>
            <button
                type="button"
                onClick={stay}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-full border border-foreground text-sm font-medium"
            >
                Stay signed in
            </button>
        </dialog>
    );
}
