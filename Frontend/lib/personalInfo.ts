import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";
import {
    EMAIL_MESSAGE,
    EMAIL_PATTERN,
    NAME_MESSAGE,
    NAME_PATTERN,
    PERSONAL_INFO_MAX_LENGTH,
    PHONE_MESSAGE,
    PHONE_PATTERN,
    hasEnoughPhoneDigits,
} from "@/Backend/lib/personalInfoRules";

export type PersonalInfoField = keyof UserPersonalInfo;

// Where the details live in the browser (same key and shape the old profile form used)
export const PERSONAL_INFO_KEY = "personal-data";

// Pages involved in the "fill in your details before buying" flow
export const PROFILE_PATH = "/account";
export const CHECKOUT_PATH = "/shopping-cart/checkout";

export const EMPTY_PERSONAL_INFO: UserPersonalInfo = {
    firstname: "",
    lastname: "",
    gender: "",
    cityNprovince: "",
    district: "",
    commune: "",
    street: "",
    telephone: "",
    email: "",
};

export const FIELD_ORDER = Object.keys(EMPTY_PERSONAL_INFO) as PersonalInfoField[];

const FIELD_LABELS: Record<PersonalInfoField, string> = {
    firstname: "first name",
    lastname: "last name",
    gender: "gender",
    cityNprovince: "city or province",
    district: "district",
    commune: "commune",
    street: "street",
    telephone: "phone number",
    email: "email",
};

// The limits and patterns come from Backend/lib/personalInfoRules.ts, the same file the server check and the form inputs use,
// so most problems are caught before sending. The server is still the real gatekeeper; this check is only here to give
// people quick, friendly feedback.
export const MAX_LENGTH = PERSONAL_INFO_MAX_LENGTH;

export type PersonalInfoErrors = Partial<Record<PersonalInfoField, string>>;

export function getPersonalInfoErrors(info: UserPersonalInfo): PersonalInfoErrors {
    const errors: PersonalInfoErrors = {};

    for (const field of FIELD_ORDER) {
        const value = info[field].trim();
        if (value.length === 0) {
            errors[field] = field === "gender" ? "Choose an option" : `Enter your ${FIELD_LABELS[field]}`;
        } else if (value.length > MAX_LENGTH[field]) {
            errors[field] = `Use ${MAX_LENGTH[field]} characters or fewer`;
        }
    }

    for (const field of ["firstname", "lastname"] as const) {
        if (!errors[field] && !NAME_PATTERN.test(info[field].trim())) errors[field] = NAME_MESSAGE;
    }
    if (!errors.telephone) {
        const phone = info.telephone.trim();
        if (!PHONE_PATTERN.test(phone) || !hasEnoughPhoneDigits(phone)) errors.telephone = PHONE_MESSAGE;
    }
    if (!errors.email && !EMAIL_PATTERN.test(info.email.trim())) {
        errors.email = EMAIL_MESSAGE;
    }

    return errors;
}

// Only allow redirects to pages on this site (stops "?next=https://evil.example" tricks)
export function safeNextPath(value: string | null): string | null {
    return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}
