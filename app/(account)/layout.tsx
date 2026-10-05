import { Suspense } from "react";
import SiteHeader from "@/Frontend/components/navbar/SiteHeader";
import AccountNav from "@/Frontend/components/navbar/AccountNav";
import BottomTabBar from "@/Frontend/components/navbar/BottomTabBar";
import SiteFooter from "@/Frontend/components/layout/SiteFooter";

// Account pages now share the shop's header, bottom tab bar and footer (the old desktop sidebar is gone)
export default function AccountLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <SiteHeader />
            <main className="flex-1">
                <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-2">
                    <AccountNav />
                    {children}
                </div>
            </main>
            <SiteFooter />
            <Suspense fallback={null}>
                <BottomTabBar />
            </Suspense>
        </>
    )
}
