import Link from "next/link";
import { CATEGORIES } from "@/Frontend/components/navbar/categories";

export default function CategoryTiles() {
    return (
        <section aria-labelledby="category-title" className="mt-8 px-4 lg:mt-12">
            <h2 id="category-title" className="m-0 mb-3 text-base font-medium lg:mb-4 lg:text-xl">Shop by category</h2>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6">
                {CATEGORIES.map(category => (
                    <li key={category.href}>
                        <Link
                            href={category.href}
                            className="flex aspect-square items-end rounded-xl bg-panel p-3 text-base font-medium transition active:scale-[0.98] lg:aspect-video lg:p-5 lg:text-lg"
                        >
                            {category.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
