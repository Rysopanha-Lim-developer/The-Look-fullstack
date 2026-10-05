"use client"
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/Backend/models/product.model';

export type  CartContextType = {
    items: Product[];
    addItem: (item: Product) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);

    const addItem = (item: Product) => {
        setItems(prev => {
                const isAlreadyInCart = prev.some(i => i._id === item._id);
                if (isAlreadyInCart) return prev;
                return [...prev, item];
            });
    };


    const removeItem = (slug: string) => {
        setItems(prev => prev.filter(i => i.slug !== slug));
    };

    // used after an order is placed
    const clearCart = () => setItems([]);

    return (
            <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
                {children}
            </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}