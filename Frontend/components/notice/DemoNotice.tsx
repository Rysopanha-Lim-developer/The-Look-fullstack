"use client";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "demo-notice-dismissed";
const CHANGE_EVENT = "demo-notice-changed";

// If the browser blocks sessionStorage, this still hides the card until the next full page load
let dismissedInMemory = false;

function subscribe(onChange: () => void) {
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function isDismissed(): boolean {
    if (dismissedInMemory) return true;
    try {
        return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
        return false;
    }
}

// A small card pinned to the bottom of the screen. It shows once per visit: sessionStorage is cleared when the tab closes,
// so it comes back the next time someone opens the site, but not on every page or refresh within the same visit.
export default function DemoNotice() {
    // The server renders nothing (treated as already dismissed); the browser decides after it loads
    const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
    if (dismissed) return null;

    const dismiss = () => {
        dismissedInMemory = true;
        try {
            sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
            // blocked storage: the in-memory flag above is enough for this page load
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    };

    return (
        // bottom offset (5.25rem = 84px) clears the tab bar (56px) and the 72px action bar on phones; wider screens use the corner
        <section
            aria-label="Demo store notice"
            className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-background p-3 shadow-lg md:inset-x-auto md:bottom-4 md:left-4 md:mx-0"
        >
            <p className="m-0 flex-1 text-[13px] leading-snug">
                <strong className="font-medium">Demo store.</strong> This is a learning project, not a real shop. Nothing is sold or delivered.
                Please don&apos;t send real money or enter real payment details. If you do, it&apos;s at your own risk.
            </p>
            <button
                type="button"
                onClick={dismiss}
                className="h-11 shrink-0 rounded-full bg-foreground px-4 text-sm font-medium text-background"
            >
                Got it
            </button>
        </section>
    );
}
