import { Suspense } from "react";
import { GetDisplayProduct } from "@/Backend/lib/GetDisplayProduct";
import SectionNav from "./SectionNav";
import CategorySection from "./CategorySection";
import type { CategoryConfig } from "./categoryConfig";

// Shared by the Men, Women, Girls and Boys pages. Each page only passes its own config.
export default function CategoryPage({ config }: { config: CategoryConfig }) {
    return (
        <div className="mx-auto w-full max-w-page pb-6">
            <Suspense fallback={<CategorySkeleton config={config} />}>
                <CategoryContent config={config} />
            </Suspense>
        </div>
    );
}

async function CategoryContent({ config }: { config: CategoryConfig }) {
    const products = await GetDisplayProduct();

    // Sort the products into this page's sections, and drop sections that have nothing in them
    const sections = config.sections
        .map(section => ({
            id: section.id,
            title: section.title,
            items: products
                .filter(product => section.prefixes.some(prefix => product.slug.startsWith(prefix)))
                .map(({ _id, slug, name, image, price }) => ({ _id, slug, name, image, price })),
        }))
        .filter(section => section.items.length > 0);

    const total = sections.reduce((sum, section) => sum + section.items.length, 0);

    return (
        <>
            <div className="px-4 pb-3 pt-4">
                <h1 className="m-0 text-[1.75rem] font-medium leading-tight">{config.title}</h1>
                <p className="m-0 mt-0.5 text-sm text-muted">{total} items</p>
            </div>
            <SectionNav sections={sections.map(({ id, title }) => ({ id, title }))} />
            {sections.map(section => (
                <CategorySection key={section.id} id={section.id} title={section.title} items={section.items} />
            ))}
        </>
    );
}

// Gray placeholders shown while products load
function CategorySkeleton({ config }: { config: CategoryConfig }) {
    return (
        <div aria-hidden="true">
            <div className="px-4 pb-3 pt-4">
                <p className="m-0 text-[1.75rem] font-medium leading-tight">{config.title}</p>
            </div>
            <div className="flex gap-2 overflow-hidden border-b border-line px-4 py-1.5">
                {config.sections.map(section => (
                    <span key={section.id} className="h-8 w-20 shrink-0 rounded-full bg-chip" />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 pt-6 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-square rounded-xl bg-panel" />
                ))}
            </div>
        </div>
    );
}
