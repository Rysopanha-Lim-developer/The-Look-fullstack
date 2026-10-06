"use client";
import { Moon, Sun } from "lucide-react";
import { setPreference, usePreference } from "@/Frontend/hooks/usePreference";

// Manual light/dark switch. It does not follow the device setting: the visitor chooses, and the choice is saved.
export default function ThemeToggle() {
    const theme = usePreference("theme", "light");
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setPreference("theme", "theme", isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex size-11 items-center justify-center"
        >
            {/* Icons switch with CSS, so they are right on the very first paint */}
            <Moon size={22} aria-hidden="true" className="dark:hidden" />
            <Sun size={22} aria-hidden="true" className="hidden dark:block" />
        </button>
    );
}
