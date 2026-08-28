import { Product } from "@/app/models/product.model"
import Image from "next/image";

export type DisplayCardProps = {
    data: Omit<Product, "slug" | "material" | "brand" | "color">
}

export default function DisplayCard({data}: DisplayCardProps){
    console.log(data.name, data.price, data.image)
    return(
        <article>
            <div>
                <Image src={data.image} alt={data.image} width={150} height={100} />
            </div>
            <div>
                <p>{data.name}</p>
                <p>{data.price}</p>
            </div>
        </article>
    )
}