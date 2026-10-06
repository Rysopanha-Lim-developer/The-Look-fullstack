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
        <section className="mx-4 rounded-2xl bg-foreground p-5 text-background lg:flex lg:min-h-72 lg:flex-col lg:items-start lg:justify-center lg:rounded-3xl lg:p-14">
            <p className="m-0 text-sm text-background/70 lg:text-base">{eyebrow}</p>
            <h2 className="m-0 mt-1 text-[1.75rem] font-medium leading-tight lg:text-6xl">{title}</h2>
            <Link href={ctaHref} className="mt-4 inline-flex h-11 items-center rounded-full bg-background px-5 text-sm lg:mt-8 lg:h-12 lg:px-8 lg:text-base font-medium text-foreground">
                {ctaLabel}
            </Link>
        </section>
    );
}
