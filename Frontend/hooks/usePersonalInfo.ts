"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { UserPersonalInfo } from "@/Backend/lib/Types/generalTypes.module";
import {
    EMPTY_PERSONAL_INFO,
    FIELD_ORDER,
    PERSONAL_INFO_KEY,
    getPersonalInfoErrors,
} from "@/Frontend/lib/personalInfo";

const CHANGE_EVENT = "personal-info-changed"; // "storage" only fires in OTHER tabs, so we send our own for this tab 

function readRaw(): string {
    try {
        return localStorage.getItem(PERSONAL_INFO_KEY) ?? "{}";
    } catch {
        return "{}"; // storage can be blocked (private mode)
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

// Always returns all nine fields as strings, so a missing field becomes "" and never the word "undefined"
function parse(raw: string): UserPersonalInfo {
    const info = { ...EMPTY_PERSONAL_INFO };
    try {
        const value = JSON.parse(raw);
        if (value && typeof value === "object") {
            for (const field of FIELD_ORDER) {
                if (typeof value[field] === "string") info[field] = value[field];
            }
        }
    } catch {
        // broken data: keep the empty defaults
    }
    return info;
}

export function usePersonalInfo() {
    const raw = useSyncExternalStore(subscribe, readRaw, () => "{}");
    // false on the server and while hydrating, true afterwards: pages wait for it before deciding anything
    const ready = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    const info = useMemo(() => parse(raw), [raw]);
    const errors = useMemo(() => getPersonalInfoErrors(info), [info]);

    const save = useCallback((next: UserPersonalInfo) => {
        try {
            localStorage.setItem(PERSONAL_INFO_KEY, JSON.stringify(next));
        } catch {
            return false;
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
        return true;
    }, []);

    return { info, ready, errors, isComplete: Object.keys(errors).length === 0, save };
}
