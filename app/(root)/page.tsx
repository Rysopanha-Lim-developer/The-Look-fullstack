import { Suspense } from "react";
import PromoBanner from "@/Frontend/components/home/PromoBanner";
import CategoryTiles from "@/Frontend/components/home/CategoryTiles";
import HomeProducts, { HomeProductsSkeleton } from "@/Frontend/components/home/HomeProducts";

export default function Home() {
    return (
        <div className="mx-auto w-full max-w-page pb-6 pt-4 lg:pb-10 lg:pt-8">
            <h1 className="sr-only">The Look: fashion for men, women and kids in Cambodia</h1>
            <PromoBanner />
            <CategoryTiles />
            {/* The Suspense boundary lets the page shell appear instantly while products stream in */}
            <Suspense fallback={<HomeProductsSkeleton />}>
                <HomeProducts />
            </Suspense>
        </div>
    );
}
