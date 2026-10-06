type SectionSidebarProps = {
    sections: { id: string; title: string }[];
    active: string | undefined;
};

// Laptop list of sections. Names only. The active one gets a black bar and a darker background.
export default function SectionSidebar({ sections, active }: SectionSidebarProps) {
    return (
        <nav aria-label="Sections" className="sticky top-24">
            <ul className="m-0 flex list-none flex-col p-0">
                {sections.map(section => {
                    const isActive = active === section.id;
                    return (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                aria-current={isActive ? "true" : undefined}
                                className={`flex h-11 items-center rounded-r-lg border-l-2 px-4 text-sm transition-colors ${
                                    isActive
                                        ? "border-foreground bg-chip font-medium text-foreground"
                                        : "border-transparent text-muted hover:text-foreground"
                                }`}
                            >
                                {section.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
