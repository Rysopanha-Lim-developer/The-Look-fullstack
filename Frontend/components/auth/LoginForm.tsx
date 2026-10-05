"use client"
import Link from "next/link";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormField from "@/Frontend/components/common/FormField";
import PasswordField from "@/Frontend/components/auth/PasswordField";
import { getAuthErrorMessage, getEmailError, getLoginPasswordError, getUsernameError } from "@/Frontend/lib/authRules";
import { safeNextPath } from "@/Frontend/lib/personalInfo";

type Field = "username" | "email" | "password";

export default function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const next = safeNextPath(params.get("next"));          // where to go after signing in (checkout, for example)
    const justRegistered = params.get("registered") === "1";

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const errors: Partial<Record<Field, string>> = {
        username: getUsernameError(username),
        email: getEmailError(email),
        password: getLoginPasswordError(password),
    };
    const shown = (field: Field) => (submitted || touched[field] ? errors[field] : undefined);
    const touch = (field: Field) => setTouched(current => ({ ...current, [field]: true }));

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting) return;
        setSubmitted(true);
        setFormError(null);

        const firstProblem = (["username", "email", "password"] as Field[]).find(field => errors[field]);
        if (firstProblem) {
            document.getElementById(`login-${firstProblem}`)?.focus();
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
            });
            if (res.ok) {
                router.refresh();
                router.push(next ?? "/");
                return;
            }
            // Only the status code is used. The server's own message is never shown.
            setFormError(getAuthErrorMessage("login", res.status));
        } catch {
            setFormError(getAuthErrorMessage("login", "network"));
        } finally {
            setSubmitting(false);
        }
    }

    const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";

    return (
        <section>
            <h1 className="m-0 text-center text-[1.75rem] font-medium leading-tight">Sign in</h1>
            <p className="m-0 mt-1 text-center text-sm text-muted">The paradise for stylish people</p>

            {justRegistered && (
                <p role="status" className="m-0 mt-5 rounded-lg bg-chip px-3 py-2 text-sm">Account created. Please sign in to continue.</p>
            )}
            <div role="alert" className="empty:hidden">
                {formError && <p className="m-0 mt-5 rounded-lg border border-danger px-3 py-2 text-sm text-danger">{formError}</p>}
            </div>

            <form noValidate onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
                <FormField
                    id="login-username"
                    label="Username"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    onBlur={() => touch("username")}
                    error={shown("username")}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={30}
                />
                <FormField
                    id="login-email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    onBlur={() => touch("email")}
                    error={shown("email")}
                    autoComplete="email"
                    maxLength={254}
                />
                <PasswordField
                    id="login-password"
                    label="Password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    onBlur={() => touch("password")}
                    error={shown("password")}
                    autoComplete="current-password"
                    maxLength={64}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background disabled:opacity-60"
                >
                    {submitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="m-0 mt-5 text-center text-sm text-muted">
                New here? <Link href={registerHref} className="text-foreground underline">Create an account</Link>
            </p>
            <p className="m-0 mt-3 text-center text-sm text-muted">Demo site: please don&apos;t use a real password.</p>
        </section>
    );
}
