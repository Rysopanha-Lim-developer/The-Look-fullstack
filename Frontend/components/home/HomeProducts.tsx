import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import { Product } from "@/Backend/models/product.model";
import ProductCard from "./ProductCard";

// Same rule your old home page used for "New Product"
const isNewArrival = (product: Product) => product.slug.startsWith("men-accessories") || product.price == 100;

export default async function HomeProducts() {
    const products = await GetDisplayProduct();
    const newArrivals = products.filter(isNewArrival);
    const more = products.filter(product => !isNewArrival(product)).slice(0, 8);

    return (
        <>
            {newArrivals.length > 0 && (
                <section id="new-arrivals" aria-labelledby="new-arrivals-title" className="mt-8 scroll-mt-16">
                    <h2 id="new-arrivals-title" className="m-0 mb-3 px-4 text-base font-medium">New arrivals</h2>
                    {/* Phones: swipe row. Wider screens: a normal grid. */}
                    <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
                        {newArrivals.map(product => (
                            <li key={product._id} className="w-[42vw] max-w-48 shrink-0 snap-start md:w-auto md:max-w-none">
                                <ProductCard product={product} sizes="(max-width: 768px) 42vw, 22vw" />
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {more.length > 0 && (
                <section aria-labelledby="more-title" className="mt-8">
                    <h2 id="more-title" className="m-0 mb-3 px-4 text-base font-medium">More to explore</h2>
                    <ul className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4">
                        {more.map(product => (
                            <li key={product._id}>
                                <ProductCard product={product} sizes="(max-width: 768px) 46vw, 22vw" />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}

// Gray placeholders shown while the products load
export function HomeProductsSkeleton() {
    return (
        <section aria-hidden="true" className="mt-8 px-4">
            <div className="mb-3 h-5 w-32 rounded bg-chip" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-square rounded-xl bg-panel" />
                ))}
            </div>
        </section>
    );
}
