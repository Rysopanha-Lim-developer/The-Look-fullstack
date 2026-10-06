"use client";
import Link from "next/link";
import ProductImage from "@/Frontend/components/product/ProductImage/ProductImage";
import { useCart } from "@/Frontend/hooks/CartContext";
import { Product } from "@/Backend/models/product.model";

export default function CartItemRow({ item }: { item: Product }) {
    const { removeItem } = useCart();

    return (
        <li className="flex gap-3 border-t border-line py-3 last:border-b">
            <Link href={`/${item.slug}`} className="w-20 shrink-0 lg:w-24" aria-hidden="true" tabIndex={-1}>
                <ProductImage src={item.image} alt="" sizes="(max-width: 1024px) 80px, 96px" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/${item.slug}`} className="line-clamp-2 text-sm leading-snug">
                    {item.name}
                </Link>
                <span className="mt-0.5 text-sm text-muted">{item.color}</span>
                <span className="mt-1 text-sm font-medium lg:hidden">${item.price}</span>
            </div>

            <div className="flex flex-col items-end self-start">
                {/* laptops: the price sits on the right, above Remove */}
                <span className="hidden pr-1 text-sm font-medium lg:block">${item.price}</span>
                <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="min-h-11 px-1 text-sm text-muted underline"
                >
                    Remove
                </button>
            </div>
        </li>
    );
}
