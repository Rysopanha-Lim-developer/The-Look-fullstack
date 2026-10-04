import { CATEGORY_PAGES, type CategoryConfig } from "./categoryConfig";

const pages: Record<string, CategoryConfig> = CATEGORY_PAGES;

// Given a product slug like "men-shirts-12", find which category page and section it belongs to.
// The product page uses this to build the "Men / Shirts" link back to /men#shirts.
export function findSectionForSlug(slug: string) {
    for (const [key, category] of Object.entries(pages)) {
        const section = category.sections.find(s => s.prefixes.some(prefix => slug.startsWith(prefix)));
        if (section) {
            return {
                href: `/${key}#${section.id}`,
                categoryTitle: category.title,
                sectionTitle: section.title,
            };
        }
    }
    return null; // slug doesn't match any section, so the page simply shows no back link
}
