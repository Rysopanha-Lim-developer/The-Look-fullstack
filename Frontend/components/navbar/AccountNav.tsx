"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { label: "Profile", href: "/account" },
    { label: "Orders", href: "/account/order" },
    { label: "Payment", href: "/account/payment" },
];

// Small pill row at the top of every account page. Log out sits at the far end.
export default function AccountNav() {
    const pathname = usePathname();

    return (
        <nav aria-label="Account" className="mb-5 border-b border-line">
            <ul className="m-0 flex list-none items-center overflow-x-auto p-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {LINKS.map(link => {
                    const active = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);
                    return (
                        <li key={link.href} className="shrink-0">
                            <Link href={link.href} aria-current={active ? "page" : undefined} className="flex h-11 items-center px-1">
                                <span className={`rounded-full px-4 py-1.5 text-sm ${active ? "bg-foreground text-background" : "bg-chip"}`}>
                                    {link.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
                <li className="ml-auto shrink-0">
                    <Link href="/account/logout" className="flex h-11 items-center px-3 text-sm text-danger">Log out</Link>
                </li>
            </ul>
        </nav>
    );
}
