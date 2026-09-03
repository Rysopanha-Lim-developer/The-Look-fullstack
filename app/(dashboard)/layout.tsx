import Image from "next/image"
import {  ShieldLock, ArrowRightLeft, BanknoteArrowDown, Mail, Phone, Send  } from "lucide-react"
import { Facebook, Tiktok, Instagram, XFormerlyTwitter  } from "@thesvg/react";


export default function DashboardLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header className="flex items-center justify-center">
                <Image src="/assets/Logo/logo.svg" width={200} height={100} alt="Brand logo" />
            </header>
            <main>
                {children}
            </main>
            <footer className="Footer">
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
        </>
    )
}