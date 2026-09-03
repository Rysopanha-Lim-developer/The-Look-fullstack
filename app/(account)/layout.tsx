import Image from "next/image"
import Link from "next/link"
import { ShieldLock, ArrowRightLeft, BanknoteArrowDown, Mail, Phone, Send  } from "lucide-react"
import { Facebook, Tiktok, Instagram, XFormerlyTwitter  } from "@thesvg/react";

export default function AccountLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header className="flex items-center justify-center">
                <Image src="/assets/Logo/logo.svg" width={200} height={100} alt="Brand logo" />
            </header>
            <main className="flex w-full">
                <section className="w-[25%] border-r flex flex-col">
                    <div className="w-full border-b flex flex-col items-start justify-start pl-1.5">
                        <h1 className="my-0">Account</h1>
                    </div>
                    <div className="w-full border-b flex flex-col items-start justify-start pl-1.5">
                        <Link href="/account"><h3 className="nav-link">Profile</h3></Link>
                        <Link href="/account/order"><h3 className="nav-link">My Order</h3></Link>
                        <Link href="/account/payment"><h3 className="nav-link">Payment</h3></Link>
                        <Link href="/shopping-cart"><h3 className="nav-link">My Cart</h3></Link>
                        <Link href="/wish-list"><h3 className="nav-link">Wishlist</h3></Link>
                        <Link href="/account/setting"><h3 className="nav-link">Setting</h3></Link>
                    </div>
                    <div className="w-full flex flex-col items-start justify-start pl-1.5">
                        <Link href=""><h3 className="nav-link">Customer Support</h3></Link>
                        <a href=""><h3 className="nav-link">Log out</h3></a>
                    </div>
                </section>
                <section className="w-[70%] flex flex-col pt-2.5">
                    {children}
                </section>
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