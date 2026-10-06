"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/Frontend/hooks/CartContext";

export default function CartLink() {
    const { items } = useCart();
    const count = items.length;

    return (
        <Link
            href="/shopping-cart"
            aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
            className="relative flex size-11 items-center justify-center"
        >
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-on-light">
                    {count}
                </span>
            )}
        </Link>
    );
}
