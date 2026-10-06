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
                <section id="new-arrivals" aria-labelledby="new-arrivals-title" className="mt-8 scroll-mt-16 lg:mt-12 lg:scroll-mt-20">
                    <h2 id="new-arrivals-title" className="m-0 mb-3 px-4 text-base font-medium lg:mb-4 lg:text-xl">New arrivals</h2>
                    {/* Phones: swipe row. Wider screens: a normal grid. */}
                    <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible lg:gap-6">
                        {newArrivals.map(product => (
                            <li key={product._id} className="w-[42vw] max-w-48 shrink-0 snap-start md:w-auto md:max-w-none">
                                <ProductCard product={product} sizes="(max-width: 768px) 42vw, (max-width: 1280px) 22vw, 300px" />
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {more.length > 0 && (
                <section aria-labelledby="more-title" className="mt-8 lg:mt-12">
                    <h2 id="more-title" className="m-0 mb-3 px-4 text-base font-medium lg:mb-4 lg:text-xl">More to explore</h2>
                    <ul className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 lg:gap-6">
                        {more.map(product => (
                            <li key={product._id}>
                                <ProductCard product={product} sizes="(max-width: 768px) 46vw, (max-width: 1280px) 22vw, 300px" />
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
        <section aria-hidden="true" className="mt-8 px-4 lg:mt-12">
            <div className="mb-3 h-5 w-32 rounded bg-chip" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-square rounded-xl bg-panel" />
                ))}
            </div>
        </section>
    );
}
