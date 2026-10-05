"use client";
import { Heart } from "lucide-react";
import ProductCard from "@/Frontend/components/home/ProductCard";
import { useFavorites } from "@/Frontend/hooks/useFavorites";
import { Product } from "@/Backend/models/product.model";

// A product card with a filled heart on top. Tapping the heart removes it from favorites.
export default function FavoriteCard({ product }: { product: Product }) {
    const { toggle } = useFavorites();

    return (
        <div className="relative">
            <ProductCard product={product} sizes="(max-width: 768px) 46vw, 22vw" />
            {/* The heart is a sibling of the card link (not inside it), because a button inside a link is invalid HTML */}
            <button
                type="button"
                onClick={() => toggle(product)}
                aria-label={`Remove ${product.name} from favorites`}
                className="absolute right-0 top-0 flex size-11 items-center justify-center"
            >
                <span className="flex size-8 items-center justify-center rounded-full bg-background/90">
                    <Heart size={18} fill="currentColor" aria-hidden="true" />
                </span>
            </button>
        </div>
    );
}
