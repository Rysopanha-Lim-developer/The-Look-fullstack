import InfiniteLogoScroll from "../components/InfiniteLogoScroll/InfiniteLogoScroll";
import Image from "next/image";

export default function Home() {
    return (<>
        <div>
            <Image src="/assets/Banner/BigSaleBanner.jpg" alt="Sale banner" width={1200} height={100} className="w-dvw h-auto" />
        </div>
        <InfiniteLogoScroll />
    </>);
}
