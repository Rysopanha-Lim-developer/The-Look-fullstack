"use client";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";
import { money } from "@/Frontend/lib/money";

export type ReceiptData = {
    orderId?: string; // full order id from the server; shown as the same short "#ABC123" the Orders page uses
    createdAt: string; // ISO date text
    info: UserPersonalInfo;
    items: { name: string; color?: string; price: number }[];
    total: number;
};

const noopSubscribe = () => () => {};

// eThe recipt is never seen on screen. It is placed inside <div id="print-root"> (see app/layout.tsx),
// which is hidden on screen and is the ONLY thing left visible when printing or saving as PDF (see globals.css).
// Colors are fixed (not theme tokens) so the paper copy is the same in light and dark mode.
export default function Receipt({ receipt }: { receipt: ReceiptData }) {
    // false on the server and during hydration, true in the browser afterwards (document does not exist on the server)
    const isBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);
    const target = isBrowser ? document.getElementById("print-root") : null;
    if (!target) return null;

    const { info } = receipt;
    const date = new Date(receipt.createdAt).toLocaleString("en-US", {
        timeZone: "Asia/Phnom_Penh",
        dateStyle: "medium",
        timeStyle: "short",
    });

    return createPortal(
        <article className="mx-auto w-full max-w-[170mm] bg-white text-[13px] leading-relaxed text-black">
            <header className="flex items-baseline justify-between border-b-2 border-black pb-3">
                <h1 className="m-0 text-2xl font-medium tracking-wide">THE LOOK</h1>
                <p className="m-0 text-base">Receipt</p>
            </header>

            <section className="mt-4 flex justify-between gap-6">
                <div>
                    {receipt.orderId && <p className="m-0 font-medium">Order #{receipt.orderId.slice(-6).toUpperCase()}</p>}
                    <p className="m-0">{date} (Phnom Penh time)</p>
                </div>
                <div className="text-right">
                    <p className="m-0 font-medium">Delivery details</p>
                    <p className="m-0">{info.firstname} {info.lastname}</p>
                    <p className="m-0">{info.telephone}</p>
                    <p className="m-0">{info.email}</p>
                    <p className="m-0">{info.street}, {info.commune}, {info.district}, {info.cityNprovince}</p>
                </div>
            </section>

            <table className="mt-6 w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-black">
                        <th className="py-2 pr-3 font-medium">Item</th>
                        <th className="py-2 pr-3 font-medium">Color</th>
                        <th className="py-2 text-right font-medium">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {receipt.items.map((item, index) => (
                        <tr key={index} className="border-b border-neutral-300">
                            <td className="py-2 pr-3">{item.name}</td>
                            <td className="py-2 pr-3">{item.color ?? ""}</td>
                            <td className="py-2 text-right">{money(item.price)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} className="pt-3 text-base font-medium">Total</td>
                        <td className="pt-3 text-right text-base font-medium">{money(receipt.total)}</td>
                    </tr>
                </tfoot>
            </table>

            <p className="mt-10 border border-black p-3 text-center">
                <strong className="font-medium">Demo store.</strong> This is a learning project, not a real shop. Nothing was sold or
                delivered, and no payment was taken. This receipt has no value.
            </p>
        </article>,
        target,
    );
}
