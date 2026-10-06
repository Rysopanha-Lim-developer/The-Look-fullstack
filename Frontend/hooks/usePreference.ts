"use client";
import { useSyncExternalStore } from "react";

// Visitor preferences (theme, category sidebar) live in two places:
// 1) localStorage, so the choice survives a reload
// 2) a data-* attribute on <html>, so CSS can react to it. The small script in app/layout.tsx sets that attribute
//    before the first paint, which is why there is no flash of the wrong theme or sidebar.
const CHANGE_EVENT = "preference-changed"; // the "storage" event only fires in OTHER tabs, so we send our own for this tab

function subscribe(onChange: () => void) {
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

// attribute: the data-* name on <html> (data-theme -> "theme"). The server has no <html> to read, so it uses the fallback.
export function usePreference(attribute: string, fallback: string) {
    return useSyncExternalStore(
        subscribe,
        () => document.documentElement.dataset[attribute] ?? fallback,
        () => fallback,
    );
}

export function setPreference(storageKey: string, attribute: string, value: string) {
    document.documentElement.dataset[attribute] = value;
    try {
        localStorage.setItem(storageKey, value);
    } catch {
        // storage can be blocked (private mode); the choice then lasts until the page closes
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}
