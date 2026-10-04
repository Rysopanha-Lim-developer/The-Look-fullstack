import { Suspense } from "react";
import { ShieldLock, ArrowRightLeft, BanknoteArrowDown, Mail, Phone, Send  } from "lucide-react"
import { Facebook, Tiktok, Instagram, XFormerlyTwitter  } from "@thesvg/react";
import { CartProvider } from "@/Frontend/hooks/CartContext";
import SiteHeader from "@/Frontend/components/navbar/SiteHeader";
import BottomTabBar from "@/Frontend/components/navbar/BottomTabBar";


export default function RootLayout({children}: {children: React.ReactNode}){
    return(
        <CartProvider>
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            {/* bottom padding clears the fixed bars on phones: tab bar 56px, or the product page action bar ~72px, plus the iPhone safe area */}
            <footer className="Footer pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0 print:hidden">
                <ul className="media">
                    <li>Follow Us</li>
                    <li ><Facebook variant="mono" width={24} height={24} /> The Look Cambodia</li>
                    <li ><Tiktok variant="mono" width={24} height={24} /> @theLookCambodia</li>
                    <li ><Instagram variant="mono" width={24} height={24} /> @theLookCambodia</li>
                    <li ><XFormerlyTwitter width={24} height={24} /> @theLookCambodia</li>
                </ul>
                <ul className="media">
                    <li>Customer services</li>
                    <li >
                        <ShieldLock /> 
                        Privacy Policy</li>
                    <li ><ArrowRightLeft /> Item Exchange</li>
                    <li ><BanknoteArrowDown /> Cash Refund</li>
                </ul>
                <ul className="media">
                    <li>Contact Us</li>
                    <li ><Mail /> tLook@gmail.com</li>
                    <li ><Phone /> (+855) 23 888 999</li>
                    <li ><Send /> @theLookCambodia</li>
                </ul>
        </footer>
            <Suspense fallback={null}>
                <BottomTabBar />
            </Suspense>
        </CartProvider>
    )
}