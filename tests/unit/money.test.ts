import { describe, it, expect } from "vitest";
import { money } from "@/Frontend/lib/money";

describe("money()", () => {
    it("shows whole dollars without decimals", () => {
        expect(money(15)).toBe("$15");
    });

    it("shows two decimals for cents", () => {
        expect(money(5.5)).toBe("$5.50");
    });
});