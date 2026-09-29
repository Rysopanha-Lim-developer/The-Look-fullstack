import { Product, ProductModel } from "@/Backend/models/product.model";
import { Suspense } from "react";
import { dbConnection } from "@/Backend/lib/dbConnection";
import ProductDetail from "@/Frontend/components/product/ProductDetails/ProductDetails";
import ProductDetailSkeleton from "@/Frontend/components/common/ProductDetailLoading/ProductSkeleton";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export type PageParams = {
    params: Promise<Pick<Product, "slug">>
}

export type DetailProps = {
    props: Pick<Product, "slug">
}


export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    await dbConnection();
    const { slug } = await params;
    const product: Product | null = await ProductModel.findOne({ slug }).lean();

    if (!product) {
        return { title: "Product not found" };
    }

    return {
        title: product.name,
        description: `Buy ${product.name} by ${product.brand} for $${product.price} at The Look.`,
        openGraph: {
            images: [product.image],
        },
    };
}


export default function DetailPage({params}: PageParams){
    return(
        <Suspense fallback={<ProductDetailSkeleton/>}>
            <Details params={params}/>
        </Suspense>
    )
}

async function Details({params}:PageParams) {
    await dbConnection();
    const {slug} = await params;
    let productDetail:Product = await ProductModel.findOne({slug: slug}).lean();
    if(!productDetail) notFound();
    productDetail = JSON.parse(JSON.stringify(productDetail));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productDetail.name,
        image: new URL(productDetail.image, "https://thelook.vercel.app").toString(),
        brand: { "@type": "Brand", name: productDetail.brand },
        color: productDetail.color,
        material: productDetail.material,
        offers: {
            "@type": "Offer",
            url: `https://thelook.vercel.app/${slug}`,
            priceCurrency: "USD",
            price: productDetail.price,
        },
    };

    return(
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
        />
        <ProductDetail props={productDetail}/>
        </>
    )
}