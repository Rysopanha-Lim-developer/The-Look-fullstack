import { Order } from "@/Backend/models/order.model"

export default function OrderDisplayCard({props}:{props: Order[]}){
    return(
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {props.map((order:Order) => {
                const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
                    timeZone: 'Asia/Phnom_Penh',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                });
                return (
                <article key={order._id.toString()} className="rounded-xl border border-line bg-white p-4 text-sm">
                    <h3 className="m-0 break-all text-sm">Order ID: {order._id.toString()}</h3>
                    <p>Fullname: {order.userPersonalInfo.firstname} {order.userPersonalInfo.lastname}</p>
                    <p>Email: {order.userPersonalInfo.email}</p>
                    <p>Create At: {formattedDate}</p>
                    <p>Number of items: {order.orderItems.length}</p>
                </article>
                )
            })}
        </section>
    )
}