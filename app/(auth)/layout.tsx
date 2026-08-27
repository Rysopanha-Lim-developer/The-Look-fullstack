import Image from "next/image"


export default function RootLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header>
                
            </header>
            <main>
                {children}
            </main>
            <footer className="Footer">
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