import Link from "next/link";

export default function MenNavbar(){
    return(
        <nav className="nav-bar">
            <ul className="nav-bar-ul w-full">
                <li>
                    <Link  href="#tshirts" className="nav-link text-[1.2rem]">
                        T-shirts
                    </Link>
                </li>
                <li>
                    <Link  href="#shirts" className="nav-link text-[1.2rem]">
                        Shirts
                    </Link>
                </li>
                <li>
                    <Link  href="#shorts" className="nav-link text-[1.2rem]">
                        Shorts
                    </Link>
                </li>
                <li>
                    <Link  href="#jeans-pants" className="nav-link text-[1.2rem]">
                        Jeans-Pants
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