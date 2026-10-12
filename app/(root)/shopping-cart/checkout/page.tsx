"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Printer, QrCode } from "lucide-react";
import ActionBar from "@/Frontend/components/common/ActionBar/ActionBar";
import { useCart } from "@/Frontend/hooks/CartContext";
import { usePersonalInfo } from "@/Frontend/hooks/usePersonalInfo";
import { CHECKOUT_PATH, PROFILE_PATH } from "@/Frontend/lib/personalInfo";
import { money } from "@/Frontend/lib/money";
import Receipt, { type ReceiptData } from "@/Frontend/components/checkout/Receipt";
import { printReceipt } from "@/Frontend/lib/printReceipt";

type Session = "loading" | "signed-in" | "signed-out" | "error";
type OrderError = "details" | "signed-out" | "unavailable" | "other" | null;

// Set NEXT_PUBLIC_PAYWAY_ENABLED=true to pay with an ABA KHQR code. Anything else keeps the old demo "Place order" button.
const PAYWAY_ENABLED = process.env.NEXT_PUBLIC_PAYWAY_ENABLED === "true";

// ?next= makes the profile page send people straight back here after they save
const next = encodeURIComponent(CHECKOUT_PATH);
const editDetailsHref = `${PROFILE_PATH}?next=${next}`;
// ?reason=checkout makes the profile page show the "add your details first" popup
const fillDetailsHref = `${PROFILE_PATH}?reason=checkout&next=${next}`;

// the login page sends people back to checkout after they sign in
const signInHref = `/login?next=${next}`;

const primaryLink = "mt-6 flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background";

export default function Checkout(){
    const router = useRouter();
    const { items, clearCart } = useCart();
    const { info, ready, isComplete } = usePersonalInfo();
    const [session, setSession] = useState<Session>("loading");
    const [submitting, setSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<OrderError>(null);
    const [placed, setPlaced] = useState(false);
    const [receipt, setReceipt] = useState<ReceiptData | null>(null); // a copy of the order, kept after the cart is cleared

    // Ask the server whether anyone is signed in (the same endpoint the old page used)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/order");
                if (!cancelled) setSession(res.ok ? "signed-in" : "signed-out");
            } catch {
                if (!cancelled) setSession("error");
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Signed in, something in the cart, but name or address missing: send them to fill it in first.
    // replace (not push) so the Back button doesn't bounce them straight into this redirect again.
    const mustFillDetails = ready && session === "signed-in" && !placed && items.length > 0 && !isComplete;
    useEffect(() => {
        if (mustFillDetails) router.replace(fillDetailsHref);
    }, [mustFillDetails, router]);

    const total = items.reduce((sum, item) => sum + item.price, 0);

    // ABA KHQR: the server creates a pending order and a QR code, then the payment page shows it and waits for the payment.
    // The cart is NOT cleared here; the payment page clears it once the payment is confirmed.
    async function payWithKhqr() {
        if (submitting) return;
        if (!isComplete) {
            router.replace(fillDetailsHref);
            return;
        }
        setSubmitting(true);
        setOrderError(null);
        try {
            const res = await fetch("/api/payway/qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, userPersonalInfo: info }),
            });
            if (res.ok) {
                const data = await res.json().catch(() => null);
                if (typeof data?.orderId === "string") {
                    router.push(`${CHECKOUT_PATH}/pay/${data.orderId}`);
                    return; // keep the button disabled while the next page opens
                }
            }
            setOrderError(res.status === 400 ? "details" : res.status === 401 ? "signed-out" : res.status === 503 ? "unavailable" : "other");
        } catch {
            setOrderError("other");
        }
        setSubmitting(false);
    }

    async function placeOrder() {
        if (submitting) return;
        // second safety net in case the details were cleared while this page was open
        if (!isComplete) {
            router.replace(fillDetailsHref);
            return;
        }
        setSubmitting(true);
        setOrderError(null);
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, userPersonalInfo: info }),
            });
            if (res.ok) {
                // The server answers with the prices it really charged (and, when available, the order id and time).
                // The receipt uses those; if the answer cannot be read, it falls back to what the cart showed.
                const data = await res.json().catch(() => null);
                const serverPrice = new Map<string, number>(
                    (data?.orderItems ?? []).map((line: { productId: string; priceAtPurchase: number }) => [String(line.productId), line.priceAtPurchase]),
                );
                const lines = items.map(item => ({ name: item.name, color: item.color, price: serverPrice.get(String(item._id)) ?? item.price }));
                setReceipt({
                    orderId: typeof data?.orderId === "string" ? data.orderId : undefined,
                    createdAt: typeof data?.createdAt === "string" ? data.createdAt : new Date().toISOString(),
                    info,
                    items: lines,
                    total: lines.reduce((sum, line) => sum + line.price, 0),
                });
                setPlaced(true);
                clearCart();
                return;
            }
            setOrderError(res.status === 400 ? "details" : res.status === 401 ? "signed-out" : "other");
        } catch {
            setOrderError("other");
        } finally {
            setSubmitting(false);
        }
    }

    // 1. Order placed (checked first, because clearing the cart would otherwise show "cart is empty")
    if (placed) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center">
                <h1 className="m-0 text-2xl font-medium">Order placed</h1>
                <p className="m-0 mt-2 max-w-sm text-sm text-muted">
                    Thank you! This is a demo store, so nothing will be delivered and nothing was charged.
                </p>
                <Link href="/account/order" className={primaryLink}>View my orders</Link>
                {receipt && (
                    <button
                        type="button"
                        onClick={() => printReceipt(receipt.orderId)}
                        className="mt-2 flex h-12 items-center gap-2 rounded-full border border-foreground px-8 text-sm font-medium"
                    >
                        <Printer size={18} aria-hidden="true" />
                        Print or save receipt
                    </button>
                )}
                <Link href="/" className="mt-2 flex h-12 items-center px-6 text-sm text-muted underline">Keep shopping</Link>
                {receipt && <Receipt receipt={receipt} />}
            </div>
        );
    }

    // 2. Still working out who is signed in and what details are saved
    if (!ready || session === "loading") {
        return (
            <div role="status" className="mx-auto w-full max-w-3xl animate-pulse px-4 pt-4">
                <span className="sr-only">Loading checkout</span>
                <div className="h-8 w-40 rounded bg-chip" />
                <div className="mt-6 h-36 rounded-xl bg-chip" />
                <div className="mt-6 h-36 rounded-xl bg-chip" />
            </div>
        );
    }

    // 3. Nothing to buy
    if (items.length === 0) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center">
                <h1 className="m-0 text-2xl font-medium">Your cart is empty</h1>
                <p className="m-0 mt-2 text-sm text-muted">Add something to your cart before checking out.</p>
                <Link href="/" className={primaryLink}>Keep shopping</Link>
            </div>
        );
    }

    // 4. Not signed in (or the session expired), or the server could not be reached
    if (session !== "signed-in") {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center">
                <h1 className="m-0 text-2xl font-medium">
                    {session === "error" ? "Could not reach the server" : "Sign in to check out"}
                </h1>
                <p className="m-0 mt-2 max-w-sm text-sm text-muted">
                    {session === "error"
                        ? "Check your connection and try again."
                        : "Your cart will be waiting for you. Your session may also have expired."}
                </p>
                {session === "error"
                    ? <button type="button" onClick={() => window.location.reload()} className={primaryLink}>Try again</button>
                    : <Link href={signInHref} className={primaryLink}>Sign in</Link>}
            </div>
        );
    }

    // 5. Details missing: the redirect effect above is already taking them to the profile page
    if (!isComplete) {
        return (
            <div role="status" className="mx-auto w-full max-w-3xl px-4 py-20 text-center text-sm text-muted">
                Taking you to your delivery details...
                <div className="mt-3"><Link href={fillDetailsHref} className="underline">Continue now</Link></div>
            </div>
        );
    }

    // 6. Ready to order
    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-2 lg:max-w-5xl lg:pb-16 lg:pt-6">
            <Link href="/shopping-cart" className="inline-flex min-h-11 items-center gap-1 text-sm text-muted">
                <ChevronLeft size={16} aria-hidden="true" />
                Cart
            </Link>
            <h1 className="m-0 mt-1 text-[1.75rem] font-medium leading-tight">Checkout</h1>

            {/* laptops: delivery details on the left, a summary card that stays in view while scrolling on the right */}
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10">
            <section aria-labelledby="delivery-title" className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                    <h2 id="delivery-title" className="m-0 text-base font-medium">Delivery details</h2>
                    <Link href={editDetailsHref} className="inline-flex min-h-11 items-center px-1 text-sm text-muted underline">Edit</Link>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed">
                    <p className="m-0 font-medium">{info.firstname} {info.lastname}</p>
                    <p className="m-0">{info.telephone}</p>
                    <p className="m-0">{info.email}</p>
                    <p className="m-0 mt-2 text-muted">{info.street}, {info.commune}, {info.district}, {info.cityNprovince}</p>
                </div>
            </section>

            {PAYWAY_ENABLED && (
                <section aria-labelledby="payment-title" className="mt-6 lg:col-start-1 lg:mt-0">
                    <h2 id="payment-title" className="m-0 mb-2 text-base font-medium">Payment</h2>
                    {/* only one way to pay, so this is a single card that is always selected */}
                    <div className="flex items-center gap-3 rounded-xl border-2 border-foreground bg-surface p-4 text-sm">
                        <QrCode size={28} aria-hidden="true" className="shrink-0" />
                        <div>
                            <p className="m-0 font-medium">ABA KHQR</p>
                            <p className="m-0 text-muted">Scan with ABA Mobile or any KHQR banking app.</p>
                        </div>
                    </div>
                </section>
            )}

            <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-5 lg:rounded-xl lg:bg-chip lg:p-5">
            <section aria-labelledby="summary-title" className="mt-6 lg:mt-0">
                <h2 id="summary-title" className="m-0 mb-2 text-base font-medium">Order summary</h2>
                <ul className="m-0 list-none rounded-xl border border-line bg-surface p-4 text-sm lg:border-0 lg:bg-transparent lg:p-0">
                    {items.map(item => (
                        <li key={item._id} className="flex justify-between gap-4 py-1">
                            <span className="min-w-0">{item.name}</span>
                            <span className="shrink-0">{money(item.price)}</span>
                        </li>
                    ))}
                    <li className="mt-2 flex justify-between border-t border-line pt-3 text-base font-medium">
                        <span>Total</span>
                        <span>{money(total)}</span>
                    </li>
                </ul>
                <p className="m-0 mt-3 text-sm text-muted">
                    {PAYWAY_ENABLED ? "You will get a QR code to scan on the next page." : "Demo store: no real payment is taken."}
                </p>
            </section>

            <div role="alert" className="mt-4 text-sm text-danger empty:hidden">
                {orderError === "details" && (
                    <>Some of your details were not accepted. <Link href={editDetailsHref} className="underline">Check them here</Link>.</>
                )}
                {orderError === "signed-out" && (
                    <>Your session has expired. <Link href={signInHref} className="underline">Sign in again</Link>.</>
                )}
                {orderError === "unavailable" && "Online payment is not available right now. Please try again later."}
                {orderError === "other" && "Something went wrong and your order was not placed. Please try again."}
            </div>

            <ActionBar className="lg:mt-4">
                <button
                    type="button"
                    onClick={PAYWAY_ENABLED ? payWithKhqr : placeOrder}
                    disabled={submitting}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background disabled:opacity-60"
                >
                    {PAYWAY_ENABLED
                        ? (submitting ? "Creating QR code..." : `Pay with ABA KHQR · ${money(total)}`)
                        : (submitting ? "Placing order..." : `Place order · ${money(total)}`)}
                </button>
            </ActionBar>
            </aside>
            </div>
        </div>
    )
}
