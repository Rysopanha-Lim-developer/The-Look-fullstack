import Image from "next/image";
import Link from "next/link";
import { Heart, User } from "lucide-react";
import CartLink from "./CartLink";
import { CATEGORIES } from "./categories";

export default function SiteHeader() {
    // h-14 sits on the header itself (border included), so the category pill row can stick at exactly top-14
    return (
        <header className="sticky top-0 z-40 h-14 border-b border-line bg-background print:hidden">
            <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-4">
                <Link href="/" aria-label="The Look, home" className="flex items-center">
                    <Image src="/assets/Logo/logo.svg" alt="The Look" width={200} height={100} className="h-9 w-auto" />
                </Link>

                {/* Category links only show on wider screens; phones use the bottom tab bar */}
                <nav aria-label="Main" className="hidden md:flex md:gap-6">
                    {CATEGORIES.map(category => (
                        <Link key={category.href} href={category.href} className="text-base font-medium">
                            {category.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center">
                    <Link href="/favorite" aria-label="Favorites" className="flex size-11 items-center justify-center">
                        <Heart size={22} aria-hidden="true" />
                    </Link>
                    <CartLink />
                    <Link href="/account" aria-label="Account" className="hidden size-11 items-center justify-center md:flex">
                        <User size={22} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
