import { Product } from "@/app/models/product.model"
import Image from "next/image";

export type DisplayCardProps = {
    data: Omit<Product, "material" | "brand" | "color">
}

export default function DisplayCard({data}: DisplayCardProps){
    console.log(data.name, data.price, data.image)
    return(
        <article className="displayCard">
            <div className="cardWrapper">
                <div className="cardImageWrapper">
                    <Image src={data.image} alt={data.image} width={150} height={100} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="cardText">
                        <p>{data.name}</p>
                        <p>${data.price}</p>
                    </div>
                    <button>See detail</button>
                </div>
            </div>
        </article>
    )
}