"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "./categories";

const TABS = [...CATEGORIES, { label: "Account", href: "/account" }];

export default function BottomTabBar() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Shop sections"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
        >
            <ul className="mx-auto flex max-w-lg">
                {TABS.map(tab => {
                    const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    return (
                        <li key={tab.href} className="flex-1">
                            <Link
                                href={tab.href}
                                prefetch={tab.href === "/account" ? false : undefined}
                                aria-current={active ? "page" : undefined}
                                className={`flex h-14 items-center justify-center border-t-2 text-xs ${
                                    active ? "border-foreground font-medium text-foreground" : "border-transparent text-muted"
                                }`}
                            >
                                {tab.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
