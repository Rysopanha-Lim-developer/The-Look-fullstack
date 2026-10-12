"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleCheck, Printer, Smartphone } from "lucide-react";
import { useCart } from "@/Frontend/hooks/CartContext";
import { CHECKOUT_PATH } from "@/Frontend/lib/personalInfo";
import { money } from "@/Frontend/lib/money";
import { printReceipt } from "@/Frontend/lib/printReceipt";
import Receipt, { type ReceiptData } from "@/Frontend/components/checkout/Receipt";
import type { PaymentStatus } from "@/Backend/services/GetPaywayStatus";

const POLL_MS = 4000;

type Problem = "signed-out" | "not-found" | "network" | null;

const primaryButton = "mt-5 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background";
const secondaryButton = "mt-2 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-foreground px-8 text-sm font-medium";

// shown on the PayWay sandbox so nobody thinks real money is moving
const TestModeNote = () => (
    <p className="m-0 mb-4 rounded-full bg-chip px-4 py-1 text-xs font-medium">Test mode: no real money is taken</p>
);

const clock = (totalSeconds: number) =>
    `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;

// The QR payment page. It never decides anything itself: it asks the server (/api/payway/status) every few seconds,
// and the server asks PayWay. The page only shows what the server says.
export default function PaywayPayment({ orderId }: { orderId: string }) {
    const { clearCart } = useCart();
    const [payment, setPayment] = useState<PaymentStatus | null>(null);
    const [problem, setProblem] = useState<Problem>(null);
    const [now, setNow] = useState<number | null>(null);
    const cartCleared = useRef(false);

    // Ask for the status now and then every few seconds. Stops by itself once the payment is paid, expired or failed.
    useEffect(() => {
        let stopped = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const controller = new AbortController();

        async function poll() {
            try {
                const res = await fetch(`/api/payway/status?orderId=${encodeURIComponent(orderId)}`, {
                    cache: "no-store",
                    signal: controller.signal,
                });
                if (stopped) return;
                if (res.ok) {
                    const data = (await res.json()) as PaymentStatus;
                    if (stopped) return;
                    setPayment(data);
                    setProblem(null);
                    if (data.status !== "pending") return; // a final answer: no more asking
                } else if (res.status === 401) {
                    setProblem("signed-out");
                    return;
                } else if (res.status === 404) {
                    setProblem("not-found");
                    return;
                } else {
                    setProblem("network");
                }
            } catch {
                if (stopped) return;
                setProblem("network");
            }
            timer = setTimeout(poll, POLL_MS);
        }
        poll();

        return () => {
            stopped = true;
            controller.abort();
            clearTimeout(timer);
        };
    }, [orderId]);

    // One-second clock for the countdown (only while a QR code is on screen)
    const waiting = payment?.status === "pending";
    useEffect(() => {
        if (!waiting) return;
        const tick = () => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const every = setInterval(tick, 1000);
        return () => {
            clearTimeout(first);
            clearInterval(every);
        };
    }, [waiting]);

    // The cart is emptied only when the payment is really confirmed (and only once)
    const paid = payment?.status === "paid";
    useEffect(() => {
        if (paid && !cartCleared.current) {
            cartCleared.current = true;
            clearCart();
        }
    }, [paid, clearCart]);

    const payPath = `${CHECKOUT_PATH}/pay/${orderId}`;
    const wrapper = "mx-auto flex w-full max-w-md flex-col items-center px-4 pb-10 pt-6 text-center";

    // ---- the page could not load the payment at all ----
    if (problem === "signed-out") {
        return (
            <div className={wrapper}>
                <h1 className="m-0 text-2xl font-medium">Sign in to see this payment</h1>
                <p className="m-0 mt-2 text-sm text-muted">Your session may have expired.</p>
                <Link href={`/login?next=${encodeURIComponent(payPath)}`} className={primaryButton}>Sign in</Link>
            </div>
        );
    }
    if (problem === "not-found") {
        return (
            <div className={wrapper}>
                <h1 className="m-0 text-2xl font-medium">We could not find this payment</h1>
                <Link href="/account/order" className={primaryButton}>View my orders</Link>
            </div>
        );
    }
    if (!payment) {
        return (
            <div role="status" className={`${wrapper} animate-pulse`}>
                <span className="sr-only">Loading payment</span>
                <div className="h-8 w-40 rounded bg-chip" />
                <div className="mt-6 aspect-square w-full max-w-72 rounded-2xl bg-chip" />
                {problem === "network" && <p className="m-0 mt-4 text-sm text-muted">Trying to reach the server...</p>}
            </div>
        );
    }

    // ---- paid ----
    if (payment.status === "paid") {
        const receipt: ReceiptData | null = payment.receipt
            ? { orderId: payment.orderId, ...payment.receipt, paymentLabel: "Paid with ABA KHQR" }
            : null;
        return (
            <div className={wrapper}>
                {payment.testMode && <TestModeNote />}
                <CircleCheck size={40} aria-hidden="true" />
                <h1 className="m-0 mt-3 text-2xl font-medium">Payment received</h1>
                <p className="m-0 mt-2 max-w-sm text-sm text-muted">Thank you! Your order {money(payment.amount)} is paid.</p>
                <Link href="/account/order" className={primaryButton}>View my orders</Link>
                {receipt && (
                    <button type="button" onClick={() => printReceipt(receipt.orderId)} className={secondaryButton}>
                        <Printer size={18} aria-hidden="true" />
                        Print or save receipt
                    </button>
                )}
                <Link href="/" className="mt-2 flex h-12 items-center px-6 text-sm text-muted underline">Keep shopping</Link>
                {receipt && <Receipt receipt={receipt} />}
            </div>
        );
    }

    // ---- expired or failed: nothing was charged, start again from checkout ----
    if (payment.status === "expired" || payment.status === "failed") {
        return (
            <div className={wrapper}>
                <h1 className="m-0 text-2xl font-medium">
                    {payment.status === "expired" ? "This QR code has expired" : "The payment did not go through"}
                </h1>
                <p className="m-0 mt-2 max-w-sm text-sm text-muted">
                    Nothing was charged. Go back to checkout to create a new code.
                </p>
                <Link href={CHECKOUT_PATH} className={primaryButton}>Back to checkout</Link>
            </div>
        );
    }

    // ---- pending: show the QR code ----
    const secondsLeft = now !== null && payment.expiresAt
        ? Math.max(0, Math.round((new Date(payment.expiresAt).getTime() - now) / 1000))
        : null;

    return (
        <div className={wrapper}>
            {payment.testMode && <TestModeNote />}
            <h1 className="m-0 text-2xl font-medium">Scan to pay</h1>
            <p className="m-0 mt-1 text-sm text-muted">Total <strong className="font-medium text-foreground">{money(payment.amount)}</strong></p>

            {/* the QR code always sits on a white panel: it must stay light in dark mode or phones cannot read it */}
            <div className="mt-5 w-full max-w-72 rounded-2xl bg-white p-3">
                {payment.qrImage ? (
                    // a base64 image straight from PayWay, so next/image has nothing to optimise
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={payment.qrImage} alt={`ABA KHQR code to pay ${money(payment.amount)}`} className="block h-auto w-full" />
                ) : (
                    <p className="m-0 p-8 text-sm text-black">The QR code is not available. Go back to checkout and try again.</p>
                )}
            </div>

            <p role="status" className="m-0 mt-4 text-sm">
                Waiting for your payment...
                {secondsLeft !== null && (
                    <span className="block text-muted">
                        {secondsLeft > 0 ? `This code expires in ${clock(secondsLeft)}` : "Time is up. Checking for a last-second payment..."}
                    </span>
                )}
                {problem === "network" && <span className="block text-muted">Connection problem, trying again...</span>}
            </p>

            {/* a phone cannot scan its own screen, so phones get a button that opens ABA Mobile directly */}
            {payment.deeplink && (
                <a href={payment.deeplink} className={`${primaryButton} md:hidden`}>
                    <Smartphone size={18} aria-hidden="true" />
                    Open ABA Mobile
                </a>
            )}

            <ol className="m-0 mt-6 list-none space-y-1 p-0 text-sm text-muted">
                <li>1. Open ABA Mobile or any KHQR banking app.</li>
                <li>2. Scan this code and confirm the payment.</li>
                <li>3. Stay on this page. It updates by itself.</li>
            </ol>

            <Link href={CHECKOUT_PATH} className="mt-4 flex min-h-11 items-center px-4 text-sm text-muted underline">Cancel and go back</Link>
        </div>
    );
}
