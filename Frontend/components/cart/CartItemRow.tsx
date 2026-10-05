"use client";
import Link from "next/link";
import ProductImage from "@/Frontend/components/product/ProductImage/ProductImage";
import { useCart } from "@/Frontend/hooks/CartContext";
import { Product } from "@/Backend/models/product.model";

export default function CartItemRow({ item }: { item: Product }) {
    const { removeItem } = useCart();

    return (
        <li className="flex gap-3 border-t border-line py-3 last:border-b">
            <Link href={`/${item.slug}`} className="w-20 shrink-0" aria-hidden="true" tabIndex={-1}>
                <ProductImage src={item.image} alt="" sizes="80px" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/${item.slug}`} className="line-clamp-2 text-sm leading-snug">
                    {item.name}
                </Link>
                <span className="mt-0.5 text-sm text-muted">{item.color}</span>
                <span className="mt-1 text-sm font-medium">${item.price}</span>
            </div>

            <button
                type="button"
                onClick={() => removeItem(item.slug)}
                aria-label={`Remove ${item.name} from cart`}
                className="min-h-11 self-start px-1 text-sm text-muted underline"
            >
                Remove
            </button>
        </li>
    );
}
