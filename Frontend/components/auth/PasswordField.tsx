"use client";
import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    id: string;
    label: string;
    error?: string;
    hint?: string;
};

// Password input with a show/hide button (the old forms always showed the password as plain text)
export default function PasswordField({ id, label, error, hint, className, ...inputProps }: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1 block text-sm text-muted">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={`h-12 w-full rounded-lg border bg-white pl-3 pr-12 text-base text-foreground ${error ? "border-danger" : "border-field"}`}
                    {...inputProps}
                />
                <button
                    type="button"
                    onClick={() => setVisible(current => !current)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted"
                >
                    {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
            </div>
            {hint && <p id={hintId} className="m-0 mt-1 text-sm text-muted">{hint}</p>}
            {error && <p id={errorId} className="m-0 mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}
