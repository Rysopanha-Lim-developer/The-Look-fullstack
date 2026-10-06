"use client";
import { useEffect, useRef, useState } from "react";

type SectionNavProps = {
    sections: { id: string; title: string }[];
};

// Sticky pill row. It sits right under the 56px (h-14), or 64px (lg:h-16), site header, so both use the same number.
export default function SectionNav({ sections }: SectionNavProps) {
    const [active, setActive] = useState(sections[0]?.id);
    const rowRef = useRef<HTMLUListElement>(null);

    // Scroll spy: the active section is the last one whose top edge has passed just under the sticky bars
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            let current = sections[0]?.id;
            for (const { id } of sections) {
                const element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= 130) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [sections]);

    // Keep the active pill centered in the row when the row is wider than the screen
    useEffect(() => {
        const row = rowRef.current;
        const pill = row?.querySelector<HTMLElement>('[aria-current="true"]');
        if (row && pill) {
            row.scrollTo({ left: pill.offsetLeft - (row.clientWidth - pill.clientWidth) / 2, behavior: "smooth" });
        }
    }, [active]);

    return (
        <nav aria-label="Sections" className="sticky top-14 z-30 lg:top-16 border-b border-line bg-background">
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
