"use client"
import Link from "next/link";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Circle, CircleCheck } from "lucide-react";
import FormField from "@/Frontend/components/common/FormField";
import PasswordField from "@/Frontend/components/auth/PasswordField";
import {
    PASSWORD_RULES,
    getAuthErrorMessage,
    getEmailError,
    getUsernameError,
    isPasswordValid,
} from "@/Frontend/lib/authRules";
import { safeNextPath } from "@/Frontend/lib/personalInfo";

type Field = "username" | "email" | "password";

export default function RegisterForm() {
    const router = useRouter();
    const params = useSearchParams();
    const next = safeNextPath(params.get("next"));

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
        // the checklist under the field shows which rules are missing, so this is only a short summary
        password: isPasswordValid(password) ? undefined : "Your password doesn't meet all the rules yet",
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
            document.getElementById(`register-${firstProblem}`)?.focus();
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/new-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
            });
            if (res.ok) {
                // Registering doesn't sign anyone in, so send them to the login page with a short confirmation
                router.push(`/login?registered=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
                return;
            }
            setFormError(getAuthErrorMessage("register", res.status));
        } catch {
            setFormError(getAuthErrorMessage("register", "network"));
        } finally {
            setSubmitting(false);
        }
    }

    const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

    return (
        <section>
            <h1 className="m-0 text-center text-[1.75rem] font-medium leading-tight">Create account</h1>
            <p className="m-0 mt-1 text-center text-sm text-muted">Join The Look</p>

            <div role="alert" className="empty:hidden">
                {formError && <p className="m-0 mt-5 rounded-lg border border-danger px-3 py-2 text-sm text-danger">{formError}</p>}
            </div>

            <form noValidate onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
                <FormField
                    id="register-username"
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
                {!shown("username") && <p className="-mt-3 m-0 text-sm text-muted">5 to 12 characters</p>}

                <FormField
                    id="register-email"
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
                <div>
                    <PasswordField
                        id="register-password"
                        label="Password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        onBlur={() => touch("password")}
                        error={shown("password")}
                        autoComplete="new-password"
                        maxLength={64}
                    />
                    <ul aria-label="Password rules" className="m-0 mt-2 list-none p-0 text-sm">
                        {PASSWORD_RULES.map(rule => {
                            const met = rule.test(password);
                            return (
                                <li key={rule.id} className={`flex items-center gap-2 py-0.5 ${met ? "text-foreground" : "text-muted"}`}>
                                    {met ? <CircleCheck size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}
                                    <span className="sr-only">{met ? "Done: " : "Missing: "}</span>
                                    {rule.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background disabled:opacity-60"
                >
                    {submitting ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="m-0 mt-5 text-center text-sm text-muted">
                Have an account? <Link href={loginHref} className="text-foreground underline">Sign in</Link>
            </p>
            <p className="m-0 mt-3 text-center text-sm text-muted">Demo site: please don&apos;t use a real password.</p>
        </section>
    );
}
