"use client";
import { useEffect, useRef } from "react";

type SectionNavProps = {
    sections: { id: string; title: string }[];
    active: string | undefined;
};

// Phones and tablets: sticky pill row. It sits right under the 56px (h-14) site header.
// Laptops use the sidebar instead, so this row is hidden from lg up.
export default function SectionNav({ sections, active }: SectionNavProps) {
    const rowRef = useRef<HTMLUListElement>(null);

    // Keep the active pill centered in the row when the row is wider than the screen
    useEffect(() => {
        const row = rowRef.current;
        const pill = row?.querySelector<HTMLElement>('[aria-current="true"]');
        if (row && pill) {
            row.scrollTo({ left: pill.offsetLeft - (row.clientWidth - pill.clientWidth) / 2, behavior: "smooth" });
        }
    }, [active]);

    return (
        <nav aria-label="Sections" className="sticky top-14 z-30 border-b border-line bg-background lg:hidden">
            <ul
                ref={rowRef}
                className="relative flex overflow-x-auto px-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
            >
                {sections.map(section => {
                    const isActive = active === section.id;
                    return (
                        <li key={section.id} className="shrink-0">
                            {/* The link is 44px tall for easy tapping; the visible pill inside is smaller */}
                            <a href={`#${section.id}`} aria-current={isActive ? "true" : undefined} className="flex h-11 items-center px-1">
                                <span
                                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
                                        isActive ? "bg-foreground text-background" : "bg-chip"
                                    }`}
                                >
                                    {section.title}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
