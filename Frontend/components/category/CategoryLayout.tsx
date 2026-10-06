"use client";
import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SectionNav from "./SectionNav";
import SectionSidebar from "./SectionSidebar";
import { useActiveSection } from "./useActiveSection";
import { setPreference, usePreference } from "@/Frontend/hooks/usePreference";

type CategoryLayoutProps = {
    sections: { id: string; title: string }[];
    heading: ReactNode;
    children: ReactNode;
};

// Owns the page layout so the pills, the sidebar and the show/hide button share one scroll spy.
// Phones: heading, pill row, sections. Laptops: heading + toggle, then sidebar on the left and sections on the right.
export default function CategoryLayout({ sections, heading, children }: CategoryLayoutProps) {
    // Shown by default. The choice is saved in localStorage, and CSS (sidebar-closed:) applies it before first paint
    const sidebarOpen = usePreference("sidebar", "open") !== "closed";
    const active = useActiveSection(sections.map(section => section.id));

    return (
        <>
            <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-4 lg:pb-2 lg:pt-6">
                <div>{heading}</div>
                <button
                    type="button"
                    onClick={() => setPreference("category-sidebar", "sidebar", sidebarOpen ? "closed" : "open")}
                    aria-expanded={sidebarOpen}
                    aria-controls="category-sidebar"
                    className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium lg:inline-flex"
                >
                    {sidebarOpen ? <PanelLeftClose size={18} aria-hidden="true" /> : <PanelLeftOpen size={18} aria-hidden="true" />}
                    {sidebarOpen ? "Hide sections" : "Show sections"}
                </button>
            </div>

            <SectionNav sections={sections} active={active} />

            <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8 lg:px-4 sidebar-closed:lg:grid-cols-1">
                {/* Always in the page (so aria-controls stays valid); CSS shows it on laptops unless the visitor hid it */}
                <aside id="category-sidebar" className="hidden lg:block sidebar-closed:lg:hidden">
                    <SectionSidebar sections={sections} active={active} />
                </aside>
                <div>{children}</div>
            </div>
        </>
    );
}
