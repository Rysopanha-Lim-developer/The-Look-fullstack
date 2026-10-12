import "server-only"; // building this file into browser code is an error, so the API key can never leak to the client
import { createHmac } from "crypto";
import { HttpError } from "@/Backend/lib/errors";

// All prices in the shop are in US dollars.
export const PAYWAY_CURRENCY = "USD";

type Config = { baseUrl: string; merchantId: string; apiKey: string };

const SANDBOX_URL = "https://checkout-sandbox.payway.com.kh";

export const isSandbox = () => process.env.PAYWAY_ENV !== "production";

const prefix = () => (isSandbox() ? "SANDBOX" : "PRODUCTION");

function notAvailable(reason: string): never {
    console.error(`[payway] ${reason}`);
    throw new HttpError("Payment is not available right now.", 503);
}

function getBaseUrl(): string {
    const name = `${prefix()}_URL`;
    const raw = process.env[name]?.trim();
    if (!raw) {
        if (isSandbox()) return SANDBOX_URL;
        return notAvailable(`PAYWAY_ENV=production needs ${name} (the address PayWay gave you)`);
    }
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        return notAvailable(`${name} is not a valid address: "${raw}" (it must start with https://)`);
    }
    if (url.protocol !== "https:") return notAvailable(`${name} must start with https://`);
    if (isSandbox() !== url.hostname.includes("sandbox")) {
        return notAvailable(`PAYWAY_ENV=${isSandbox() ? "sandbox" : "production"} does not match ${name} host ${url.hostname}`);
    }
    return url.origin;
}

function getConfig(): Config {
    const merchantId = process.env[`${prefix()}_MERCHANT_ID`];
    const apiKey = process.env[`${prefix()}_PUBLIC_KEY`];
    if (!merchantId || !apiKey) {
        return notAvailable(`${prefix()}_MERCHANT_ID or ${prefix()}_PUBLIC_KEY is not set`);
    }
    return { merchantId, apiKey, baseUrl: getBaseUrl() };
}

type Fields = Record<string, string | number | undefined>;

// PayWay signs the VALUES, joined in the exact order its docs list them, with HMAC-SHA512 and your API key, as Base64.
// Fields we do not send are skipped, so the hash always covers exactly what was posted.
function sign(body: Fields, order: readonly string[], apiKey: string): string {
    const text = order.filter((key) => body[key] !== undefined).map((key) => String(body[key])).join("");
    return createHmac("sha512", apiKey).update(text).digest("base64");
}

// Order for the QR API (generate-qr). It was confirmed in the sandbox WITHOUT callback_url, return_deeplink,
// custom_fields, return_params, payout and qr_image_template. The position of those is from PayWay's Purchase API;
// if "Wrong Hash" appears right after turning one of them on, check that field's position first.
const QR_HASH_ORDER = [
    "req_time", "merchant_id", "tran_id", "amount", "items", "first_name", "last_name", "email", "phone",
    "purchase_type", "payment_option", "callback_url", "return_deeplink", "currency", "custom_fields",
    "return_params", "payout", "lifetime", "qr_image_template",
] as const;

const CHECK_HASH_ORDER = ["req_time", "merchant_id", "tran_id"] as const;

// PayWay wants the current UTC time as YYYYMMDDHHmmss
const reqTime = () => new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const base64 = (text: string) => Buffer.from(text).toString("base64");

async function post<T>(path: string, body: object): Promise<T> {
    const { baseUrl } = getConfig();
    let response: Response;
    try {
        response = await fetch(`${baseUrl}/api/payment-gateway/v1/payments/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10_000), // never leave a customer waiting on a bank that does not answer
            cache: "no-store",
        });
    } catch (error) {
        console.error(`[payway] ${path}: could not reach PayWay`, error);
        throw new HttpError("The payment service could not be reached. Please try again.", 502);
    }
    const json = (await response.json().catch(() => null)) as T | null;
    if (!json) {
        console.error(`[payway] ${path}: unreadable answer (HTTP ${response.status})`);
        throw new HttpError("The payment service sent an unreadable answer.", 502);
    }
    return json;
}

// ---------- 1. Create the QR code ----------

export type QrInput = {
    tranId: string;
    amount: number;
    items: { name: string; quantity: number; price: number }[];
    customer: { firstName: string; lastName: string; email: string; phone: string };
    lifetimeMinutes: number;
};

export type QrResult = { qrString: string; qrImage: string; deeplink: string };

type QrResponse = {
    qrString?: string;
    qrImage?: string;
    abapay_deeplink?: string;
    status?: { code?: string; message?: string; trace_id?: string };
};

export async function generateQr(input: QrInput): Promise<QrResult> {
    const { merchantId, apiKey } = getConfig();

    const body: Fields = {
        req_time: reqTime(),
        merchant_id: merchantId,
        tran_id: input.tranId,
        amount: input.amount.toFixed(2), // the same text goes into the hash and the request, so "5.50" never becomes "5.5"
        items: base64(JSON.stringify(input.items)),
        first_name: input.customer.firstName,
        last_name: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone.replace(/[^0-9+]/g, ""),
        purchase_type: "purchase",
        payment_option: "abapay_khqr",
        currency: PAYWAY_CURRENCY,
        lifetime: input.lifetimeMinutes,
    };

    // PayWay can call us back when someone pays, but only for domains the bank has whitelisted.
    // Sandbox testing does not need it: leave PAYWAY_USE_CALLBACK unset and the status endpoint asks PayWay
    // directly (Check Transaction API), so payments are still noticed.
    if (process.env.PAYWAY_USE_CALLBACK === "true") {
        const appUrl = (process.env.APP_BASE_URL ?? "https://thelook.rysopanha.com").replace(/\/+$/, "");
        body.callback_url = base64(`${appUrl}/api/payway/callback`);
    }

    const answer = await post<QrResponse>("generate-qr", { ...body, hash: sign(body, QR_HASH_ORDER, apiKey) });

    const code = String(answer.status?.code ?? "");
    if ((code !== "0" && code !== "00") || !answer.qrString || !answer.qrImage || !answer.abapay_deeplink) {
        console.error("[payway] generate-qr refused:", { code, message: answer.status?.message, trace_id: answer.status?.trace_id });
        throw new HttpError("We could not create the payment code. Please try again.", 502);
    }
    return { qrString: answer.qrString, qrImage: answer.qrImage, deeplink: answer.abapay_deeplink };
}

// ---------- 2. Ask PayWay what happened to a payment ----------

export type CheckResult = {
    state: "approved" | "pending" | "declined" | "not_found" | "other";
    amount?: number;
    currency?: string;
    apv?: string;
};

type CheckResponse = {
    data?: { payment_status?: string; payment_amount?: number; total_amount?: number; payment_currency?: string; apv?: string };
    status?: { code?: string; message?: string };
};

export async function checkTransaction(tranId: string): Promise<CheckResult> {
    const { merchantId, apiKey } = getConfig();
    const body: Fields = { req_time: reqTime(), merchant_id: merchantId, tran_id: tranId };
    const answer = await post<CheckResponse>("check-transaction-2", { ...body, hash: sign(body, CHECK_HASH_ORDER, apiKey) });

    const code = String(answer.status?.code ?? "");
    // "6" = transaction not found. That is normal while nobody has scanned the QR code yet.
    if (code === "6" || code === "06") return { state: "not_found" };
    if (code !== "0" && code !== "00") {
        console.error("[payway] check-transaction refused:", { code, message: answer.status?.message });
        throw new HttpError("Could not check the payment.", 502);
    }

    const data = answer.data;
    const status = String(data?.payment_status ?? "").toUpperCase();
    const state: CheckResult["state"] =
        status === "APPROVED" ? "approved"
        : status === "PENDING" ? "pending"
        : status === "DECLINED" || status === "CANCELLED" ? "declined"
        : "other";
    return { state, amount: data?.payment_amount ?? data?.total_amount, currency: data?.payment_currency, apv: data?.apv };
}
