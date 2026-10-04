import Link from "next/link";
import { CATEGORIES } from "@/Frontend/components/navbar/categories";

export default function CategoryTiles() {
    return (
        <section aria-labelledby="category-title" className="mt-8 px-4">
            <h2 id="category-title" className="m-0 mb-3 text-base font-medium">Shop by category</h2>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {CATEGORIES.map(category => (
                    <li key={category.href}>
                        <Link
                            href={category.href}
                            className="flex aspect-square items-end rounded-xl bg-panel p-3 text-base font-medium transition active:scale-[0.98]"
                        >
                            {category.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
