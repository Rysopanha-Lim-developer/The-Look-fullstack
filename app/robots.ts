import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/shopping-cart",   // also covers /shopping-cart/checkout
                "/account",
                "/favorite",
                "/login",
                "/register",
                "/api/",
            ],
        },
        sitemap: "https://thelook.vercel.app/sitemap.xml",
    };
}