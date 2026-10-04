// One shared list so the header, the bottom tab bar and the home tiles never drift apart.
export const CATEGORIES = [
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Girls", href: "/girls" },
    { label: "Boys", href: "/boys" },
] as const;
