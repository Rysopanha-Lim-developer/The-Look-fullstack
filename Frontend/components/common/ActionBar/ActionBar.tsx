import type { ReactNode } from "react";

// A bar fixed to the bottom of the screen on phones (it sits over the tab bar on pages that use it),
// and a normal block on wider screens. Used by the cart, checkout and profile pages.
export default function ActionBar({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:z-auto md:mt-6 md:border-0 md:bg-transparent md:p-0 ${className}`}>
            <div className="mx-auto max-w-lg md:max-w-none">{children}</div>
        </div>
    );
}
