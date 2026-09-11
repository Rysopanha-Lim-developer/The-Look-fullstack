import Link from "next/link";

export default function GirlsNavbar(){
    return(
        <nav className="nav-bar sticky pb-2 top-16 z-10 bg-[background]">
            <ul className="nav-bar-ul w-full">
                <li>
                    <Link  href="#clothing" className="nav-link text-[1.2rem]">
                        Clothing
                    </Link>
                </li>
                <li>
                    <Link  href="#hair-accessories" className="nav-link text-[1.2rem]">
                        Hair Accessories
                    </Link>
                </li>
                <li>
                    <Link  href="#shoes" className="nav-link text-[1.2rem]">
                        Shoes
                    </Link>
                </li>
                <li>
                    <Link  href="#accessories" className="nav-link text-[1.2rem]">
                        Accessories
                    </Link>
                </li>
            </ul>
        </nav>
    )
}