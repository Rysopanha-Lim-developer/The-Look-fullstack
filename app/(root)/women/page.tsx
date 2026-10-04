import CategoryPage from "@/Frontend/components/category/CategoryPage";
import { CATEGORY_PAGES } from "@/Frontend/components/category/categoryConfig";

export default function WomenPage() {
    return <CategoryPage config={CATEGORY_PAGES.women} />;
}
