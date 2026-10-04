import Image from "next/image";

type ProductImageProps = {
    src: string;
    alt: string;
    sizes: string;      // tells the browser how wide the box is, so it downloads the right file size
    preload?: boolean;  // only for the one main above-the-fold image on a page
};

export default function ProductImage({ src, alt, sizes, preload = false }: ProductImageProps) {
    return (
        <div className="productImage">
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-contain" />
        </div>
    );
}
