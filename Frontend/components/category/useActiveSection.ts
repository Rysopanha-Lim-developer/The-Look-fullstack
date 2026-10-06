"use client";
import { useEffect, useState } from "react";

// Scroll spy shared by the phone pills and the laptop sidebar.
// The active section is the last one whose top edge has passed just under the sticky bars.
export function useActiveSection(ids: string[]) {
    const [active, setActive] = useState(ids[0]);
    const key = ids.join("|"); // a string is a stable dependency, a new array on every render is not

    useEffect(() => {
        const list = key.split("|");
        let frame = 0;
        const update = () => {
            frame = 0;
            // Phones: header 56px + pill row 45px. Laptops: only the 64px header.
            const line = window.matchMedia("(min-width: 1024px)").matches ? 110 : 130;
            let current = list[0];
            for (const id of list) {
                const element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= line) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [key]);

    return active;
}
