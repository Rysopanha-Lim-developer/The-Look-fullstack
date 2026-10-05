import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    error?: string;
};

// Label above, 48px-tall input (16px text so iPhones don't zoom in), and the error shown as text, not just a red border
export default function FormField({ id, label, error, className, ...inputProps }: FormFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1 block text-sm text-muted">{label}</label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`h-12 w-full rounded-lg border bg-white px-3 text-base text-foreground ${error ? "border-danger" : "border-field"}`}
                {...inputProps}
            />
            {error && <p id={errorId} className="m-0 mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}
