"use client";
import { useState, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SectionNav from "./SectionNav";
import SectionSidebar from "./SectionSidebar";
import { useActiveSection } from "./useActiveSection";

type CategoryLayoutProps = {
    sections: { id: string; title: string }[];
    heading: ReactNode;
    children: ReactNode;
};

// Owns the page layout so the pills, the sidebar and the show/hide button share one scroll spy.
// Phones: heading, pill row, sections. Laptops: heading + toggle, then sidebar on the left and sections on the right.
export default function CategoryLayout({ sections, heading, children }: CategoryLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true); // starts shown, the visitor can hide it
    const active = useActiveSection(sections.map(section => section.id));

    return (
        <>
            <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-4 lg:pb-2 lg:pt-6">
                <div>{heading}</div>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(open => !open)}
                    aria-expanded={sidebarOpen}
                    aria-controls="category-sidebar"
                    className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium lg:inline-flex"
                >
                    {sidebarOpen ? <PanelLeftClose size={18} aria-hidden="true" /> : <PanelLeftOpen size={18} aria-hidden="true" />}
                    {sidebarOpen ? "Hide sections" : "Show sections"}
                </button>
            </div>

            <SectionNav sections={sections} active={active} />

            <div className={`lg:grid lg:gap-8 lg:px-4 ${sidebarOpen ? "lg:grid-cols-[13rem_minmax(0,1fr)]" : "lg:grid-cols-1"}`}>
                {/* Always in the page (so aria-controls stays valid); only visible on laptops while open */}
                <aside id="category-sidebar" className={sidebarOpen ? "hidden lg:block" : "hidden"}>
                    <SectionSidebar sections={sections} active={active} />
                </aside>
                <div>{children}</div>
            </div>
        </>
    );
}
