import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";

// The ONE place that decides what a valid name, phone number and email look like.
// The browser check (Frontend/lib/personalInfo.ts), the server check (Backend/services/CreateOrder.ts) and the form
// inputs all read from here, so they can never disagree. Keep this file free of server-only imports: the browser uses it too.
//
// firstname, lastname, telephone and email are also sent to ABA PayWay as the payer, so their rules follow PayWay's QR API
// (https://developer.payway.com.kh/qr-api-14530840e0). Their page is not consistent about names: the field table says
// 20 characters, but error codes 16 and 17 say "not more than 100". The stricter 20 is used so both readings are safe.

type Field = keyof UserPersonalInfo;

export const PERSONAL_INFO_MAX_LENGTH: Record<Field, number> = {
    firstname: 20, // PayWay first_name: 20
    lastname: 20, // PayWay last_name: 20
    gender: 10,
    cityNprovince: 100,
    district: 100,
    commune: 100,
    street: 200,
    telephone: 15, // PayWay phone allows 20; real phone numbers have at most 15 digits
    email: 50, // PayWay email: 50
};

// Letters of any language (Khmer included) and spaces. PayWay refuses numbers and special characters in a name (errors 16 and 17).
// \p{L} = letters, \p{M} = combining marks (Khmer vowel signs are marks).
export const NAME_PATTERN = /^[\p{L}\p{M}\s]+$/u;
export const NAME_MESSAGE = "Use letters and spaces only (no numbers or symbols)";

// 8 to 15 characters made of digits, +, spaces and -, with at least 8 real digits (so "1-2-3-4-5-6" is refused)
export const PHONE_PATTERN = /^[0-9+\s-]{8,15}$/;
export const PHONE_MIN_DIGITS = 8;
export const PHONE_MESSAGE = "Use 8 to 15 digits (you can use +, spaces and -)";
export const hasEnoughPhoneDigits = (phone: string) => (phone.match(/[0-9]/g)?.length ?? 0) >= PHONE_MIN_DIGITS;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MESSAGE = "Enter a valid email address";
