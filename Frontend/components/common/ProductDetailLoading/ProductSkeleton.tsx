/**
 * Loading placeholder for the product page. It has the same shape as the real page
 * (back link, square image, brand/name/price, three spec rows) so nothing jumps when it loads.
 */
export default function ProductDetailSkeleton() {
    return (
        <div
            role="status"
            className="mx-auto w-full max-w-page animate-pulse px-4 pb-8 pt-2 md:grid md:grid-cols-2 md:gap-10"
        >
            <span className="sr-only">Loading product</span>
            <div className="mb-3 mt-3 h-5 w-36 rounded bg-chip md:col-span-2" />
            <div className="aspect-square w-full rounded-xl bg-panel" />
            <div className="mt-4 md:mt-0">
                <div className="h-4 w-16 rounded bg-chip" />
                <div className="mt-2 h-8 w-3/4 rounded bg-chip" />
                <div className="mt-3 h-6 w-20 rounded bg-chip" />
                <div className="mt-6 space-y-3">
                    <div className="h-10 rounded bg-chip" />
                    <div className="h-10 rounded bg-chip" />
                    <div className="h-10 rounded bg-chip" />
                </div>
            </div>
        </div>
    );
}
