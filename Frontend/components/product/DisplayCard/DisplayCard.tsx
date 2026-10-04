import { Product } from "@/Backend/models/product.model";
import ProductImage from "@/Frontend/components/product/ProductImage/ProductImage";
import Link from "next/link";

export type DisplayCardProps = {
    data: Omit<Product, "material" | "brand" | "color">
}

export default function DisplayCard({data}: DisplayCardProps){
    return(
        <article className="displayCard">
            <div className="cardWrapper">
                <ProductImage src={data.image} alt={data.name} sizes="(max-width: 768px) 70vw, 22vw" />
                <div className="flex flex-col w-full">
                    <div className="cardText">
                        <p>{data.name}</p>
                        <p>${data.price}</p>
                    </div>
                    <Link className="btn" href={`/${data.slug}`}>
                        See detail
                    </Link>
                </div>
            </div>
        </article>
    )
}