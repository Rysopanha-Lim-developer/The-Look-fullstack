import Image from "next/image"
import Link from "next/link"

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
            <footer className="Footer mt-0">
                <ul className="media">
                    <li>Follow Us</li>
                    <li ><Image src="/assets/Logo/Facebook.svg"  alt="Facebook" width={24} height={24} /> The Look Cambodia</li>
                    <li ><Image src="/assets/Logo/TikTok.svg" alt="TikTok" width={24} height={24} /> @theLookCambodia</li>
                    <li ><Image src="/assets/Logo/Instagram.svg"  alt="Instagram" width={24} height={24} /> @theLookCambodia</li>
                    <li ><Image src="/assets/Logo/X.svg" alt="X" width={24} height={24} /> @theLookCambodia</li>
                </ul>
                <ul className="media">
                    <li>Customer services</li>
                    <li ><Image src="/assets/Logo/PrivacyPolicy.svg"  alt="Privacy Policy" width={24} height={24} /> Privacy Policy</li>
                    <li ><Image src="/assets/Logo/Swapping.svg"  alt="Swapping" width={24} height={24} /> Item Exchange</li>
                    <li ><Image src="/assets/Logo/MoneyLogo.svg"  alt="Money Logo" width={24} height={24} /> Cash Refund</li>
                </ul>
                <ul className="media">
                    <li>Contact Us</li>
                    <li ><Image src="/assets/Logo/Email.svg"  alt="Email" width={24} height={24} /> tLook@gmail.com</li>
                    <li ><Image src="/assets/Logo/Telephone.svg" alt="Telephone" width={24} height={24} /> (+855) 23 888 999</li>
                    <li ><Image src="/assets/Logo/Telegram.svg"  alt="Telegram" width={24} height={24} /> @theLookCambodia</li>
                </ul>
        </footer>
        </>
    )
}