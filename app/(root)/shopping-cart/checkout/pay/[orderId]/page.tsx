import type { Metadata } from "next";
import { Suspense } from "react";
import PaywayPayment from "@/Frontend/components/checkout/PaywayPayment";

export const metadata: Metadata = {
    title: "Pay with ABA KHQR",
    robots: { index: false, follow: false }, // a private page: keep it out of search results
};

// params is a promise in this version of Next.js and must be read inside <Suspense> (same pattern as app/(root)/[slug]/page.tsx)
export default function PayPage({ params }: PageProps<"/shopping-cart/checkout/pay/[orderId]">) {
    return (
        <Suspense fallback={<PaymentSkeleton />}>
            <Payment params={params} />
        </Suspense>
    );
}

async function Payment({ params }: Pick<PageProps<"/shopping-cart/checkout/pay/[orderId]">, "params">) {
    const { orderId } = await params;
    return <PaywayPayment orderId={orderId} />;
}

function PaymentSkeleton() {
    return (
        <div role="status" className="mx-auto w-full max-w-md animate-pulse px-4 pt-6">
            <span className="sr-only">Loading payment</span>
            <div className="mx-auto h-8 w-40 rounded bg-chip" />
            <div className="mx-auto mt-6 aspect-square w-full max-w-72 rounded-2xl bg-chip" />
        </div>
    );
}
