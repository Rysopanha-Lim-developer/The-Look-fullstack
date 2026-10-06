"use client"
import Link from "next/link";
import ProductCard from "@/Frontend/components/home/ProductCard";
import { useFavorites } from "@/Frontend/hooks/useFavorites";

export default function FavoritePage(){
    const { items, ready } = useFavorites();

    // Wait until the browser has read localStorage, so we don't flash "No favorites yet" first
    if (!ready) {
        return (
            <div aria-hidden="true" className="mx-auto w-full max-w-page px-4 pt-4">
                <div className="h-8 w-32 rounded bg-chip" />
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="aspect-square rounded-xl bg-panel" />
                    <div className="aspect-square rounded-xl bg-panel" />
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center">
                <h1 className="m-0 text-2xl font-medium">No favorites yet</h1>
                <p className="m-0 mt-2 text-sm text-muted">Tap the heart on a product to save it here.</p>
                <Link href="/" className="mt-6 flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background">
                    Keep shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-page px-4 pb-6 pt-4">
            <h1 className="m-0 text-[1.75rem] font-medium leading-tight">Favorites</h1>
            <p className="m-0 mb-4 mt-0.5 text-sm text-muted">{items.length} {items.length === 1 ? "item" : "items"}</p>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
                {items.map(product => (
                    <li key={product._id}>
                        <ProductCard product={product} sizes="(max-width: 768px) 46vw, (max-width: 1280px) 22vw, 300px" />
                    </li>
                ))}
            </ul>
        </div>
    )
}
