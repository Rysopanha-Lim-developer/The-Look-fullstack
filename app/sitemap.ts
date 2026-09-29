import type { MetadataRoute } from "next";
import { ProductModel } from "@/Backend/models/product.model";
import { dbConnection } from "@/Backend/lib/dbConnection";
import { connection } from "next/server";

const BASE_URL = "https://thelook.vercel.app";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await connection();
    await dbConnection();
    const products: { slug: string }[] = await ProductModel.find({}, "slug").lean();

    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        // Add your category pages here, for example:
        // { url: `${BASE_URL}/men`, changeFrequency: "weekly", priority: 0.8 },
    ];

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/${product.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticPages, ...productPages];
}