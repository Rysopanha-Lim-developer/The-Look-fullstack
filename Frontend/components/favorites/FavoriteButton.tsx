"use client";
import { Heart } from "lucide-react";
import { useFavorites, type FavoriteItem } from "@/Frontend/hooks/useFavorites";

// Heart on top of a product card. It is a sibling of the card link (not inside it), because a button inside a link is invalid HTML.
// Phones and touch screens: always visible. Mouse screens: appears on hover or keyboard focus, and stays visible once saved.
export default function FavoriteButton({ product }: { product: FavoriteItem }) {
    const { isFavorite, toggle } = useFavorites();
    const saved = isFavorite(product._id);

    return (
        <button
            type="button"
            onClick={() => toggle(product)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            className={`absolute right-0 top-0 flex size-11 items-center justify-center transition-opacity focus-visible:opacity-100 group-focus-within/card:opacity-100 can-hover:group-hover/card:opacity-100 ${
                saved ? "" : "can-hover:opacity-0"
            }`}
        >
            <span className="flex size-8 items-center justify-center rounded-full bg-background/90">
                <Heart size={18} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
            </span>
        </button>
    );
}
