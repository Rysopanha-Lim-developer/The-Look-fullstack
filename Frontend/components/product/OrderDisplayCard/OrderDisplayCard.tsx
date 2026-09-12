import { Order } from "@/Backend/models/order.model"

export default function OrderDisplayCard({props}:{props: Order[]}){
    return(
        <section className="grid grid-cols-2 gap-2 ml-2">
            {props.map((order:Order) => {
                const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
                    timeZone: 'Asia/Phnom_Penh',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                });
                return (
                <article key={order.accountId.toString()} className="border rounded-md px-2 py-1.5">
                    <h3 className="m-0">Order ID: {order._id.toString()}</h3>
                    <p>Fullname: {order.userPersonalInfo.firstname} {order.userPersonalInfo.lastname}</p>
                    <p>Email: {order.userPersonalInfo.email}</p>
                    <p>Create At: {formattedDate}</p>
                    <p>Number of items: {order.items.length}</p>
                </article>
                )
            })}
        </section>
    )
}