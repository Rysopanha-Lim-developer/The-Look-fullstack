import Link from "next/link"
import { Order } from "@/Backend/models/order.model"
import { money } from "@/Frontend/lib/money"

// Orders made before online payment existed have no status, so they show no label.
const STATUS_LABEL: Record<NonNullable<Order["status"]>, string> = {
    pending: "Awaiting payment",
    paid: "Paid",
    expired: "Expired",
    failed: "Payment failed",
};

export default function OrderDisplayCard({props}:{props: Order[]}){
    return(
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
            {props.map((order:Order) => {
                const id = order._id.toString();
                const quantity = (item: Order["orderItems"][number]) => item.quantity ?? 1;
                const itemCount = order.orderItems.reduce((sum, item) => sum + quantity(item), 0);
                const total = order.orderItems.reduce((sum, item) => sum + item.priceAtPurchase * quantity(item), 0);
                const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
                    timeZone: 'Asia/Phnom_Penh',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                });
                const { firstname, lastname, cityNprovince } = order.userPersonalInfo ?? {};
                return (
                <li key={id}>
                    <article className="rounded-xl border border-line bg-surface p-4 text-sm">
                        <div className="flex items-baseline justify-between gap-3">
                            {/* the full ID is long, so only the last 6 characters are shown */}
                            <h3 className="m-0 text-sm font-medium">Order #{id.slice(-6).toUpperCase()}</h3>
                            <span className="font-medium">{money(total)}</span>
                        </div>
                        <p className="m-0 mt-1 text-muted">{formattedDate}</p>
                        <p className="m-0 text-muted">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                        <p className="m-0 mt-2 text-muted">Deliver to {firstname} {lastname}{cityNprovince ? `, ${cityNprovince}` : ""}</p>
                        {order.status && (
                            <p className="m-0 mt-2 flex items-center justify-between gap-3">
                                <span className="rounded-full bg-chip px-3 py-1 text-xs font-medium">{STATUS_LABEL[order.status]}</span>
                                {order.status === "pending" && (
                                    <Link href={`/shopping-cart/checkout/pay/${id}`} className="inline-flex min-h-11 items-center text-sm underline">Continue payment</Link>
                                )}
                            </p>
                        )}
                    </article>
                </li>
                )
            })}
        </ul>
    )
}
