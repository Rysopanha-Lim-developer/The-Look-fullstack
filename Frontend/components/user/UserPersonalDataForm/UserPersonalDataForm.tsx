"use client"
import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";
import ActionBar from "@/Frontend/components/common/ActionBar/ActionBar";
import FormField from "@/Frontend/components/common/FormField";
import { usePersonalInfo } from "@/Frontend/hooks/usePersonalInfo";
import {
    FIELD_ORDER,
    getPersonalInfoErrors,
    safeNextPath,
    type PersonalInfoField,
} from "@/Frontend/lib/personalInfo";

const GENDERS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "none", label: "Prefer not to say" },
];

// Wait until the browser has read the saved details, so the form starts with them filled in
export function UserPersonalDataForm() {
    const { info, ready, isComplete, save } = usePersonalInfo();

    if (!ready) {
        return <div aria-hidden="true" className="h-96 animate-pulse rounded-xl bg-chip" />;
    }
    return <ProfileFields saved={info} savedIsComplete={isComplete} save={save} />;
}

type ProfileFieldsProps = {
    saved: UserPersonalInfo;
    savedIsComplete: boolean;
    save: (info: UserPersonalInfo) => boolean;
};

function ProfileFields({ saved, savedIsComplete, save }: ProfileFieldsProps) {
    const router = useRouter();
    const params = useSearchParams();
    const next = safeNextPath(params.get("next"));
    // Checkout sends people here with ?reason=checkout when their details are missing
    const showNotice = params.get("reason") === "checkout" && !savedIsComplete;

    const [draft, setDraft] = useState<UserPersonalInfo>(saved);
    const [touched, setTouched] = useState<Partial<Record<PersonalInfoField, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState<"idle" | "saved" | "failed">("idle");
    const dialogRef = useRef<HTMLDialogElement>(null);

    const errors = getPersonalInfoErrors(draft);
    const errorFor = (field: PersonalInfoField) => (submitted || touched[field] ? errors[field] : undefined);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (showNotice && dialog && !dialog.open) dialog.showModal();
    }, [showNotice]);

    const focusFirstProblem = () => {
        const first = FIELD_ORDER.find(field => errors[field]);
        if (first) document.getElementById(`field-${first}`)?.focus();
    };

    const change = (field: PersonalInfoField, value: string) => {
        setDraft(current => ({ ...current, [field]: value }));
        setStatus("idle");
    };

    const closeNotice = () => {
        dialogRef.current?.close();
        focusFirstProblem();
    };

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length > 0) {
            focusFirstProblem();
            return;
        }
        // trim stray spaces before saving
        const cleaned = Object.fromEntries(FIELD_ORDER.map(field => [field, draft[field].trim()])) as UserPersonalInfo;
        if (!save(cleaned)) {
            setStatus("failed");
            return;
        }
        if (next) router.push(next); // came from checkout: send them straight back
        else setStatus("saved");
    };

    const text = (field: PersonalInfoField, label: string, extra: object = {}) => (
        <FormField
            id={`field-${field}`}
            label={label}
            value={draft[field]}
            onChange={event => change(field, event.target.value)}
            onBlur={() => setTouched(current => ({ ...current, [field]: true }))}
            error={errorFor(field)}
            maxLength={200}
            {...extra}
        />
    );

    return (
        <>
            {showNotice && (
                <dialog
                    ref={dialogRef}
                    aria-labelledby="details-notice-title"
                    className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-background p-5 text-foreground backdrop:bg-black/40"
                >
                    <h2 id="details-notice-title" className="m-0 text-lg font-medium">Add your details first</h2>
                    <p className="m-0 mt-2 text-sm text-muted">
                        We need your name, phone number and delivery address before you can place an order.
                        Fill in the form and we will take you back to checkout.
                    </p>
                    <button
                        type="button"
                        onClick={closeNotice}
                        className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                    >
                        Fill in my details
                    </button>
                </dialog>
            )}

            <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {text("firstname", "First name", { autoComplete: "given-name" })}
                    {text("lastname", "Last name", { autoComplete: "family-name" })}
                </div>

                <fieldset className="m-0 border-0 p-0">
                    <legend className="mb-1 p-0 text-sm text-muted">Gender</legend>
                    <div className="grid grid-cols-3 gap-2">
                        {GENDERS.map((gender, index) => (
                            <label
                                key={gender.value}
                                className={`flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-foreground ${
                                    draft.gender === gender.value ? "border-foreground bg-foreground text-background" : "border-field bg-surface"
                                }`}
                            >
                                <input
                                    id={index === 0 ? "field-gender" : undefined}
                                    type="radio"
                                    name="gender"
                                    value={gender.value}
                                    checked={draft.gender === gender.value}
                                    onChange={() => change("gender", gender.value)}
                                    className="sr-only"
                                />
                                {gender.label}
                            </label>
                        ))}
                    </div>
                    {errorFor("gender") && <p className="m-0 mt-1 text-sm text-danger">{errorFor("gender")}</p>}
                </fieldset>

                {text("cityNprovince", "City / Province", { autoComplete: "address-level1" })}
                <div className="grid grid-cols-2 gap-3">
                    {text("district", "District", { autoComplete: "address-level2" })}
                    {text("commune", "Commune")}
                </div>
                {text("street", "Street", { autoComplete: "street-address" })}
                {text("telephone", "Phone", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 15 })}
                {text("email", "Email", { type: "email", inputMode: "email", autoComplete: "email" })}

                <p role="status" className="m-0 min-h-5 text-sm">
                    {status === "saved" && "Details saved."}
                    {status === "failed" && <span className="text-danger">Could not save on this device. Check your browser storage settings.</span>}
                </p>

                <ActionBar>
                    <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                    >
                        Save details
                    </button>
                </ActionBar>
            </form>
        </>
    );
}
