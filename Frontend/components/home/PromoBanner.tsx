import Link from "next/link";

type PromoBannerProps = {
    eyebrow?: string;
    title?: string;
    ctaLabel?: string;
    ctaHref?: string;
};

// Change the sale text here (or pass props from the page) instead of editing an image.
export default function PromoBanner({
    eyebrow = "Big sale",
    title = "Up to 75% off",
    ctaLabel = "Shop now",
    ctaHref = "#new-arrivals",
}: PromoBannerProps) {
    return (
        <section className="mx-4 rounded-2xl bg-foreground p-5 text-background">
            <p className="m-0 text-sm text-background/70">{eyebrow}</p>
            <h2 className="m-0 mt-1 text-[1.75rem] font-medium leading-tight">{title}</h2>
            <Link href={ctaHref} className="mt-4 inline-flex h-11 items-center rounded-full bg-background px-5 text-sm font-medium text-foreground">
                {ctaLabel}
            </Link>
        </section>
    );
}
