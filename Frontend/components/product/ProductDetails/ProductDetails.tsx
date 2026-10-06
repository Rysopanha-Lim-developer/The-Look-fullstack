"use client"
import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import ProductImage from "@/Frontend/components/product/ProductImage/ProductImage";
import { findSectionForSlug } from "@/Frontend/components/category/categoryLookup";
import { useCart } from "@/Frontend/hooks/CartContext";
import { useFavorites } from "@/Frontend/hooks/useFavorites";
import { Product } from "@/Backend/models/product.model";

export default function ProductDetail({props}: {props: Product}) {
    const detail = props;
    const { items, addItem } = useCart();
    const { isFavorite, toggle } = useFavorites();

    const inCart = items.some(item => item._id === detail._id);
    const saved = isFavorite(detail._id);
    const crumb = findSectionForSlug(detail.slug);

    return (
        <div className="mx-auto w-full max-w-page px-4 pb-8 pt-2 md:grid md:grid-cols-2 md:gap-10 md:pb-10">
            {crumb && (
                <nav aria-label="Breadcrumb" className="md:col-span-2">
                    <Link href={crumb.href} className="inline-flex min-h-11 items-center gap-1 text-sm text-muted">
                        <ChevronLeft size={16} aria-hidden="true" />
                        {crumb.categoryTitle} / {crumb.sectionTitle}
                    </Link>
                </nav>
            )}

            <ProductImage
                src={detail.image}
                alt={`${detail.brand} ${detail.name}`}
                sizes="(max-width: 768px) 92vw, 45vw"
                preload
            />

            <div className="mt-4 md:mt-0">
                <p className="m-0 text-sm text-muted">{detail.brand}</p>
                <h1 className="m-0 mt-1 text-2xl font-medium leading-tight">{detail.name}</h1>
                <p className="m-0 mt-2 text-xl font-medium">${detail.price}</p>

                <dl className="m-0 mt-6 border-b border-line text-sm">
                    <div className="flex justify-between gap-4 border-t border-line py-3">
                        <dt className="text-muted">Brand</dt>
                        <dd className="m-0 text-right font-medium">{detail.brand}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-line py-3">
                        <dt className="text-muted">Color</dt>
                        <dd className="m-0 text-right font-medium">{detail.color}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-line py-3">
                        <dt className="text-muted">Material</dt>
                        <dd className="m-0 text-right font-medium">{detail.material}</dd>
                    </div>
                </dl>

                <ul className="m-0 mt-6 grid list-none grid-cols-2 gap-3 p-0 text-center text-sm text-muted">
                    <li className="rounded-xl bg-chip px-2 py-3">Item exchange</li>
                    <li className="rounded-xl bg-chip px-2 py-3">Cash refund</li>
                </ul>

                {/* Fixed to the bottom on phones (it covers the tab bar on this page); a normal block on wider screens */}
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:z-auto md:mt-8 md:border-0 md:bg-transparent md:p-0">
                    <div className="mx-auto flex max-w-lg gap-3 md:max-w-none">
                        <button
                            type="button"
                            onClick={() => toggle(detail)}
                            aria-pressed={saved}
                            aria-label={saved ? "Remove from favorites" : "Save to favorites"}
                            className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-foreground ${
                                saved ? "bg-foreground text-background" : "bg-background text-foreground"
                            }`}
                        >
                            <Heart size={20} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                        </button>

                        {inCart ? (
                            <Link
                                href="/shopping-cart"
                                className="flex h-12 flex-1 items-center justify-center rounded-full border border-foreground text-sm font-medium"
                            >
                                Added. View cart
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => addItem(detail)}
                                className="flex h-12 flex-1 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                            >
                                Add to cart
                            </button>
                        )}
                    </div>
                    <p role="status" className="sr-only">{inCart ? "Added to cart" : ""}</p>
                </div>
            </div>
        </div>
    )
}
