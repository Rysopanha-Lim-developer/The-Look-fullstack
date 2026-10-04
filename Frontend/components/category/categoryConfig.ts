// One place that describes every category page: its sections, and which product slugs belong in each.
// To add or rename a section, edit it here. The pills, the grids and the item counts all follow.
export type CategorySectionConfig = {
    id: string;          // used for the #anchor and the pill
    title: string;
    prefixes: string[];  // a product belongs to the section if its slug starts with any of these
};

export type CategoryConfig = {
    title: string;
    sections: CategorySectionConfig[];
};

export const CATEGORY_PAGES = {
    men: {
        title: "Men",
        sections: [
            { id: "tshirts", title: "T-shirts", prefixes: ["men-tshirts-"] },
            { id: "shirts", title: "Shirts", prefixes: ["men-shirts-"] },
            { id: "shorts", title: "Shorts", prefixes: ["men-shorts-"] },
            { id: "jeans-pants", title: "Jeans & Pants", prefixes: ["men-jeans-", "men-pants-"] },
            { id: "shoes", title: "Shoes", prefixes: ["men-shoes-"] },
            { id: "accessories", title: "Accessories", prefixes: ["men-accessories-"] },
        ],
    },
    women: {
        title: "Women",
        sections: [
            { id: "tshirts", title: "T-shirts", prefixes: ["women-tshirts-"] },
            { id: "shirts", title: "Shirts", prefixes: ["women-shirts-"] },
            { id: "skirts", title: "Skirts", prefixes: ["women-skirts-"] },
            { id: "dresses", title: "Dresses", prefixes: ["women-dresses-"] },
            { id: "jeans-pants", title: "Jeans & Pants", prefixes: ["women-jeans-", "women-pants-"] },
            { id: "shoes", title: "Shoes", prefixes: ["women-shoes-"] },
            { id: "accessories", title: "Accessories", prefixes: ["women-accessories-"] },
        ],
    },
    girls: {
        title: "Girls",
        sections: [
            {
                id: "clothing",
                title: "Clothing",
                prefixes: ["girls-tshirts-", "girls-pants-", "girls-leggings-", "girls-jeans-", "girls-dresses-", "girls-cardigans-"],
            },
            { id: "hair-accessories", title: "Hair Accessories", prefixes: ["girls-hair-accessories-"] },
            { id: "shoes", title: "Shoes", prefixes: ["girls-shoes-"] },
            { id: "accessories", title: "Accessories", prefixes: ["girls-accessories-"] },
        ],
    },
    boys: {
        title: "Boys",
        sections: [
            { id: "clothing", title: "Clothing", prefixes: ["boys-tshirts-", "boys-joggers-"] },
            { id: "shoes", title: "Shoes", prefixes: ["boys-shoes-"] },
            { id: "accessories", title: "Accessories", prefixes: ["boys-accessories-"] },
        ],
    },
} satisfies Record<string, CategoryConfig>;
