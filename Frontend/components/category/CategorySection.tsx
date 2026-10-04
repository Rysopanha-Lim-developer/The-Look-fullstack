"use client";
import { useId, useRef, useState } from "react";
import ProductCard from "@/Frontend/components/home/ProductCard";
import type { Product } from "@/Backend/models/product.model";

type Item = Pick<Product, "_id" | "slug" | "name" | "image" | "price">;

type CategorySectionProps = {
    id: string;
    title: string;
    items: Item[];
};

const VISIBLE_AT_FIRST = 4;

export default function CategorySection({ id, title, items }: CategorySectionProps) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const sectionRef = useRef<HTMLElement>(null);
    const canExpand = items.length > VISIBLE_AT_FIRST;

    const toggle = () => {
        setExpanded(value => !value);
        // After "Show less" the page would be far below this section, so bring its top back into view
        if (expanded) sectionRef.current?.scrollIntoView({ block: "start" });
    };

    return (
        // scroll-mt-28 (112px) = header 56px + pill row 45px + a little air, so anchor jumps don't hide the title
        <section ref={sectionRef} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 px-4 pt-6">
            <div className="mb-3 flex items-baseline justify-between">
                <h2 id={`${id}-title`} className="m-0 text-base font-medium">{title}</h2>
                <span className="text-sm text-muted">{items.length} items</span>
            </div>

            {/* Every product stays in the page (good for search engines); extras are only hidden, and hidden images are not downloaded */}
            <ul id={listId} className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {items.map((item, index) => (
                    <li key={item._id} className={!expanded && index >= VISIBLE_AT_FIRST ? "hidden" : undefined}>
                        <ProductCard product={item} sizes="(max-width: 768px) 46vw, 22vw" />
                    </li>
                ))}
            </ul>

            {canExpand && (
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    className="mt-4 flex h-11 w-full items-center justify-center rounded-full border border-foreground text-sm font-medium"
                >
                    {expanded ? "Show less" : `Show all ${items.length}`}
                </button>
            )}
        </section>
    );
}
