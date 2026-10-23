import { describe, it, expect } from "vitest";
import { getUsernameError, getEmailError, getLoginPasswordError } from "@/Frontend/lib/authRules";

describe("getUsernameError()", () => {
    it("asks for a username when it is empty", () => {
        expect(getUsernameError("")).toBe("Enter your username");
    });

    it("rejects a username with 4 characters (one too short)", () => {
        expect(getUsernameError("abcd")).toBeDefined();
    });

    it("accepts a username with exactly 5 characters", () => {
        expect(getUsernameError("panha")).toBeUndefined();
    });

    it("accepts a username with exactly 12 characters", () => {
        expect(getUsernameError("Panhalimryso")).toBeUndefined();
    });

    it("rejects a username with 13 characters (one too long)", () => {
        expect(getUsernameError("abcdefghijklm")).toBeDefined();
    });

    it("treats a username made only of spaces as empty", () => {
        expect(getUsernameError("     ")).toBe("Enter your username");
    });

    it("ignores spaces around a valid username", () => {
        expect(getUsernameError("  abcde  ")).toBeUndefined();
    });
});

describe("getEmailError()", () => {

    it.each(
        [
            {email: "panha@gmail.com"},
            {email: "panha123@gmail.com"},
            {email: "   panha@gmail.com   "},
        ]
    )("Test valid email ", ({email}) => {
        expect(getEmailError(email)).toBeUndefined();
    });

    it.each(
        [
            {email: "panha!$@gmail.com"},
            {email: ""},
            {email: "    "}
        ]
    )("Test invalid email ", ({email}) => {
        expect(getEmailError(email)).toBeDefined();
    })
});

describe("getLoginPasswordError()", () => {
    it.each(
        [
            {password: ""},
            {password: "    "}
        ]
    )("Test empty password ", ({password}) => {
        expect(getLoginPasswordError(password)).toBe("Enter your password");
    });

    it.each(
        [
            {password: "12345"},
            {password: "12345678"},
            {password: "asdfghjklz"},
            {password: "ASDFGHJKLZ"},
            {password: "qWert12345"},
            {password: "qwert!@#$%"},
            {password: "12345!@#$%"},
            {password: "Nh45!@a"},
            {password: "Panha12345!!@"}
        ]
    )("Test invalid password ", ({password}) => {
        expect(getLoginPasswordError(password)).toBe("Check your password: 8 to 10 characters with a lowercase and an uppercase letter, a number and a special character");
    });

    it.each(
        [
            {password: "Nha145!@12"},
            {password: "Nha145!@"},
        ]
    )("Test valid password ", ({password}) => {
        expect(getLoginPasswordError(password)).toBeUndefined();
    });
});