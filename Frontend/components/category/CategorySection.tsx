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

const VISIBLE_AT_FIRST = 4; // phones and tablets: one row of cards
const VISIBLE_AT_FIRST_LAPTOP = 8; // laptops: two rows of cards

export default function CategorySection({ id, title, items }: CategorySectionProps) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const sectionRef = useRef<HTMLElement>(null);
    const canExpand = items.length > VISIBLE_AT_FIRST;
    // On laptops the button is only needed when something is still hidden after the first 8
    const buttonClass = items.length > VISIBLE_AT_FIRST_LAPTOP ? "" : "lg:hidden";

    // Cards 5 to 8 stay hidden on phones but show on laptops; everything after 8 is hidden everywhere until "Show all"
    const hiddenClass = (index: number) =>
        index >= VISIBLE_AT_FIRST_LAPTOP ? "hidden" : index >= VISIBLE_AT_FIRST ? "hidden lg:block" : undefined;

    const toggle = () => {
        setExpanded(value => !value);
        // After "Show less" the page would be far below this section, so bring its top back into view
        if (expanded) sectionRef.current?.scrollIntoView({ block: "start" });
    };

    return (
        // scroll-mt-28 (112px) = header 56px + pill row 45px + a little air; lg:scroll-mt-24 (96px) = header 64px + air (no pill row)
        <section ref={sectionRef} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 px-4 pt-6 lg:scroll-mt-24 lg:px-0 lg:pt-8">
            <div className="mb-3 flex items-baseline justify-between">
                <h2 id={`${id}-title`} className="m-0 text-base font-medium">{title}</h2>
                <span className="text-sm text-muted">{items.length} items</span>
            </div>

            {/* Every product stays in the page (good for search engines); extras are only hidden, and hidden images are not downloaded */}
            <ul id={listId} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6">
                {items.map((item, index) => (
                    <li key={item._id} className={expanded ? undefined : hiddenClass(index)}>
                        <ProductCard product={item} sizes="(max-width: 768px) 46vw, (max-width: 1024px) 22vw, 290px" />
                    </li>
                ))}
            </ul>

            {canExpand && (
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    className={`mt-4 flex h-11 w-full items-center justify-center rounded-full border border-foreground text-sm font-medium ${buttonClass}`}
                >
                    {expanded ? "Show less" : `Show all ${items.length}`}
                </button>
            )}
        </section>
    );
}
