"use client"
import Link from "next/link";
import ActionBar from "@/Frontend/components/common/ActionBar/ActionBar";
import CartItemRow from "@/Frontend/components/cart/CartItemRow";
import { useCart } from "@/Frontend/hooks/CartContext";
import { money } from "@/Frontend/lib/money";

export default function CartPage(){
    const { items } = useCart();
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);

    if (items.length === 0) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center">
                <h1 className="m-0 text-2xl font-medium">Your cart is empty</h1>
                <p className="m-0 mt-2 text-sm text-muted">Items you add will show up here.</p>
                <Link href="/" className="mt-6 flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background">
                    Keep shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-4">
            <h1 className="m-0 text-[1.75rem] font-medium leading-tight">Cart</h1>
            <p className="m-0 mb-3 mt-0.5 text-sm text-muted">{items.length} {items.length === 1 ? "item" : "items"}</p>

            <ul className="m-0 list-none p-0">
                {items.map(item => (
                    <CartItemRow key={item._id} item={item} />
                ))}
            </ul>

            <p className="m-0 mt-3 text-sm text-muted">Delivery and any taxes are not calculated yet.</p>

            <ActionBar>
                <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="text-lg font-medium">{money(subtotal)}</span>
                </div>
                <Link
                    href="/shopping-cart/checkout"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                >
                    Checkout
                </Link>
            </ActionBar>
        </div>
    )
}
