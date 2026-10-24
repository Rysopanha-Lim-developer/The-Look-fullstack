import { describe, it, expect, vi } from "vitest";
import 
    { 
        paymentMatches
    } from "@/Backend/services/ConfirmPaywayPayment";
vi.mock("server-only", () => ({}));


describe("paymentMatches()", () => {
    it.each(
        [
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount:100,
                    currency:"USD",
                    apv: undefined
                }
            },
            {
                expected:{
                    amount: 100,
                    currency: "KHR"
                },
                check:{
                    state: "approved" as const,
                    amount:100,
                    currency:"KHR",
                    apv: undefined
                }
            },
            { 
                expected: { 
                    amount: 100.004, 
                    currency: "USD" 
                },
                check:    { 
                    state: "approved" as const, 
                    amount: 100, 
                    currency: "USD" 
                } 
            },
        ]
    )("Test valid paymentMatches", ({expected, check}) => {
        expect(paymentMatches(expected, check)).toBe(true)
    });

    it.each(
        [
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount:100,
                    currency:undefined,
                    apv: undefined
                }
            }
        ]
    )("Test check.undefined currency", ({expected, check}) => {
        expect(paymentMatches(expected, check)).toBe(true)
    });

    it.each(
        [
            {
                expected:{
                    amount: 0,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount:100,
                    currency:"USD",
                    apv: undefined
                }
            },
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount:0,
                    currency:"USD",
                    apv: undefined
                }
            },
        ]
    )("Test 0 expected.amount or 0 check.amount", ({expected, check}) => {
        expect(paymentMatches(expected, check)).toBe(false)
    });

    it.each(
        [
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount: undefined,
                    currency:"USD",
                    apv: undefined
                }
            },
            { 
                expected: { 
                    amount: 100, 
                    currency: "USD" 
                },
                check:    { 
                    state: "approved" as const, 
                    amount: 100, 
                    currency: "KHR" 
                } 
            },
        ]
    )("Test undefined check.amount currency and mismatch currency", ({expected, check}) => {
        expect(paymentMatches(expected, check)).toBe(false)
    });

    it.each(
        [
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount: 101,
                    currency:"USD",
                    apv: undefined
                }
            },
            {
                expected:{
                    amount: 100,
                    currency: "USD"
                },
                check:{
                    state: "approved" as const,
                    amount: 99,
                    currency:"USD",
                    apv: undefined
                }
            },
            { 
                expected: { 
                    amount: 100.01, currency: "USD" 
                },
                check:{ 
                    state: "approved" as const, 
                    amount: 100, 
                    currency: "USD"
                }
            },
            { 
                expected: { 
                    amount: 100, 
                    currency: "USD" 
                },
                check: { 
                    state: "approved" as const, 
                    amount: 100.01, 
                    currency: "USD" 
                } 
            }
        ]
    )("Test for Math.abs(check.amount - expected.amount) >= 0.005", ({expected, check}) => {
        expect(paymentMatches(expected, check)).toBe(false)
    });
});