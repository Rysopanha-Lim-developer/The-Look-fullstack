import { Suspense } from "react";
import SiteHeader from "@/Frontend/components/navbar/SiteHeader";
import BottomTabBar from "@/Frontend/components/navbar/BottomTabBar";
import SiteFooter from "@/Frontend/components/layout/SiteFooter";


export default function RootLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
            <Suspense fallback={null}>
                <BottomTabBar />
            </Suspense>
        </>
    )
}