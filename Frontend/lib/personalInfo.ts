import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";

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

// Same limits as the zod schema in Backend/services/CreateOrder.ts, so most problems are caught before sending.
// The server is still the real gatekeeper; this check is only here to give people quick, friendly feedback.
const MAX_LENGTH: Record<PersonalInfoField, number> = {
    firstname: 50,
    lastname: 50,
    gender: 10,
    cityNprovince: 100,
    district: 100,
    commune: 100,
    street: 200,
    telephone: 15,
    email: 254,
};

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

    if (!errors.telephone && !/^[0-9+\s-]{8,15}$/.test(info.telephone.trim())) {
        errors.telephone = "Use 8 to 15 digits (you can use +, spaces and -)";
    }
    if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) {
        errors.email = "Enter a valid email address";
    }

    return errors;
}

// Only allow redirects to pages on this site (stops "?next=https://evil.example" tricks)
export function safeNextPath(value: string | null): string | null {
    return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}
