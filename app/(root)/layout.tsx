import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, User, ShieldLock, ArrowRightLeft, BanknoteArrowDown, Mail, Phone, Send  } from "lucide-react"
import { Facebook, Tiktok, Instagram, XFormerlyTwitter  } from "@thesvg/react";


export default function RootLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header className="flex w-full print:hidden sticky top-0 z-10 bg-[background]">
                <nav className="nav-bar">
                    <ul className="nav-bar-ul w-[20%]">
                        <li>
                            <Link href="/">
                                <Image src="/assets/Logo/logo.svg" width={200} height={100} alt="Brand logo" />
                            </Link>
                        </li>
                    </ul>
                    <ul className="nav-bar-ul w-[60%]">
                        <li>
                            <Link  href="/women" className="nav-link text-[1.5rem]">
                                Women
                            </Link>
                        </li>
                        <li>
                            <Link  href="/men" className="nav-link text-[1.5rem]">
                                Men
                            </Link>
                        </li>
                        <li>
                            <Link  href="/girls" className="nav-link text-[1.5rem]">
                                Girls
                            </Link>
                        </li>
                        <li>
                            <Link  href="/boys" className="nav-link text-[1.5rem]">
                                Boys
                            </Link>
                        </li>
                    </ul>
                    <ul className="nav-bar-ul w-[20%]">
                        <li>
                            <Link href="/favorite">
                                <Heart />
                            </Link>
                        </li>
                        <li>
                            <Link href="/shopping-cart">
                                <ShoppingCart />
                            </Link>
                        </li>
                        <li>
                            <Link href="/account">
                                <User />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer className="Footer print:hidden">
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