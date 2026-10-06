import Link from "next/link";
import ProductImage from "@/Frontend/components/product/ProductImage/ProductImage";
import FavoriteButton from "@/Frontend/components/favorites/FavoriteButton";
import type { FavoriteItem } from "@/Frontend/hooks/useFavorites";

type ProductCardProps = {
    product: FavoriteItem;
    sizes: string;
};

export default function ProductCard({ product, sizes }: ProductCardProps) {
    return (
        <div className="group/card relative">
            <Link href={`/${product.slug}`} className="block">
                {/* alt is empty on purpose: the product name right below already describes the link */}
                <ProductImage src={product.image} alt="" sizes={sizes} />
                <p className="m-0 mt-2 line-clamp-2 text-sm leading-snug">{product.name}</p>
                {product.price != null && <p className="m-0 mt-0.5 text-sm text-muted">${product.price}</p>}
            </Link>
            <FavoriteButton product={product} />
        </div>
    );
}
