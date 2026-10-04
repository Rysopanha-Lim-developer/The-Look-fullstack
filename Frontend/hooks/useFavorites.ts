"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Product } from "@/Backend/models/product.model";

// Same storage key and format your old code used, so the Favorites page keeps working.
const STORAGE_KEY = "favorite-items";
const CHANGE_EVENT = "favorites-changed"; // the "storage" event only fires in OTHER tabs, so we send our own for this tab

function readRaw(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? "[]";
    } catch {
        return "[]"; // storage can be blocked (private mode), so fall back to empty
    }
}

function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
}

function parse(raw: string): Product[] {
    try {
        const value = JSON.parse(raw);
        return Array.isArray(value) ? value : [];
    } catch {
        return []; // handles old broken values like the text "undefined"
    }
}

export function useFavorites() {
    // The server has no localStorage, so it renders with "[]" and the browser swaps in the real value after hydration
    const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
    const items = useMemo(() => parse(raw), [raw]);

    const isFavorite = useCallback((id: string) => items.some(item => item._id === id), [items]);

    // Tap once to save, tap again to remove (the old button added a duplicate every time)
    const toggle = useCallback(
        (product: Product) => {
            const next = items.some(item => item._id === product._id)
                ? items.filter(item => item._id !== product._id)
                : [...items, product];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                return;
            }
            window.dispatchEvent(new Event(CHANGE_EVENT));
        },
        [items],
    );

    return { isFavorite, toggle };
}
