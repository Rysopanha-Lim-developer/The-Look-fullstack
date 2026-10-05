import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/Frontend/components/layout/SiteFooter";

// Sign-in pages stay simple: just the logo, the form, and the footer
export default function AuthLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header className="flex justify-center px-4 pt-6">
                <Link href="/" aria-label="The Look, home">
                    <Image src="/assets/Logo/logo.svg" alt="The Look" width={200} height={100} className="h-10 w-auto" />
                </Link>
            </header>
            <main className="flex-1">
                <div className="mx-auto w-full max-w-sm px-4 pb-10 pt-6">
                    {children}
                </div>
            </main>
            <SiteFooter />
        </>
    )
}
