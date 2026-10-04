import { Suspense } from "react";
import PromoBanner from "@/Frontend/components/home/PromoBanner";
import CategoryTiles from "@/Frontend/components/home/CategoryTiles";
import HomeProducts, { HomeProductsSkeleton } from "@/Frontend/components/home/HomeProducts";
import TrustStrip from "@/Frontend/components/home/TrustStrip";

export default function Home() {
    return (
        <div className="mx-auto w-full max-w-5xl pb-6 pt-4">
            <h1 className="sr-only">The Look: fashion for men, women and kids in Cambodia</h1>
            <PromoBanner />
            <CategoryTiles />
            {/* The Suspense boundary lets the page shell appear instantly while products stream in */}
            <Suspense fallback={<HomeProductsSkeleton />}>
                <HomeProducts />
            </Suspense>
            <TrustStrip />
        </div>
    );
}
