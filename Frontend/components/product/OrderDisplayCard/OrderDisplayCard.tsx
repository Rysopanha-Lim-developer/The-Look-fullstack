import { Order } from "@/Backend/models/order.model"
import { money } from "@/Frontend/lib/money"

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
                    </article>
                </li>
                )
            })}
        </ul>
    )
}
