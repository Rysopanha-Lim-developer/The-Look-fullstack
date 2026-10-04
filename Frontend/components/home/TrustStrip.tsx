import { ArrowRightLeft, BanknoteArrowDown } from "lucide-react";

export default function TrustStrip() {
    return (
        <section aria-label="Our promises" className="mt-8 px-4">
            <ul className="grid grid-cols-2 gap-3 text-sm text-muted">
                <li className="flex flex-col items-center gap-1 rounded-xl bg-chip p-3 text-center">
                    <ArrowRightLeft size={20} aria-hidden="true" />
                    Item exchange
                </li>
                <li className="flex flex-col items-center gap-1 rounded-xl bg-chip p-3 text-center">
                    <BanknoteArrowDown size={20} aria-hidden="true" />
                    Cash refund
                </li>
            </ul>
        </section>
    );
}
