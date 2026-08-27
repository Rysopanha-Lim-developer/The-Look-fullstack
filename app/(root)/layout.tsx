import Image from "next/image"


export default function RootLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header className="flex w-full">
                <nav className="nav-bar">
                    <ul className="nav-bar-ul w-[20%]">
                        <li>
                            <a href="/">
                                <Image src="/assets/Logo/logo.svg" width={200} height={100} alt="Brand logo" />
                            </a>
                        </li>
                    </ul>
                    <ul className="nav-bar-ul w-[60%]">
                        <li>
                            <a  href="/women" className="nav-link">
                                Women
                            </a>
                        </li>
                        <li>
                            <a  href="/men" className="nav-link">
                                Men
                            </a>
                        </li>
                        <li>
                            <a  href="/girls" className="nav-link">
                                Girls
                            </a>
                        </li>
                        <li>
                            <a  href="/boys" className="nav-link">
                                Boys
                            </a>
                        </li>
                    </ul>
                    <ul className="nav-bar-ul w-[20%]">
                        <li>
                            <a href="/wish-list">
                                <Image src="/assets/Logo/wishListV2.svg" alt="Wish list" width={24} height={24}/>
                            </a>
                        </li>
                        <li>
                            <a href="/shopping-cart">
                                <Image src="/assets/Logo/ShoppingBag.svg" alt="Shopping cart" width={24} height={24}/>
                            </a>
                        </li>
                        <li>
                            <a href="/account">
                                <Image src="/assets/Logo/accountlogo.svg" alt="Account" width={24} height={24}/>
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                
            </footer>
        </>
    )
}