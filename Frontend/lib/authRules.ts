// These mirror the zod schema on the server (Backend/services/CreateNewUser.ts), which runs for BOTH login and register.
// Checking here first gives people instant, clear feedback. The server still has the final say.
export const USERNAME_MIN = 5;
export const USERNAME_MAX = 12;

export const PASSWORD_RULES = [
    { id: "length", label: "8 to 10 characters", test: (password: string) => password.length >= 8 && password.length <= 10 },
    { id: "lower", label: "A lowercase letter", test: (password: string) => /[a-z]/.test(password) },
    { id: "upper", label: "An uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
    { id: "number", label: "A number", test: (password: string) => /[0-9]/.test(password) },
    { id: "special", label: "A special character", test: (password: string) => /[^A-Za-z0-9]/.test(password) },
] as const;

export const isPasswordValid = (password: string) => PASSWORD_RULES.every(rule => rule.test(password));

export function getUsernameError(username: string): string | undefined {
    const value = username.trim();
    if (value.length === 0) return "Enter your username";
    if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
        return `Use ${USERNAME_MIN} to ${USERNAME_MAX} characters`;
    }
}

export function getEmailError(email: string): string | undefined {
    const value = email.trim();
    if (value.length === 0) return "Enter your email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
}

// Used by the login form (register shows the live checklist instead)
export function getLoginPasswordError(password: string): string | undefined {
    if (password.length === 0) return "Enter your password";
    if (!isPasswordValid(password)) {
        return "Check your password: 8 to 10 characters with a lowercase and an uppercase letter, a number and a special character";
    }
}

// What people see when something goes wrong. These are written here on purpose and never use the server's own message,
// so internal details stay private and the wording stays friendly and general.
// ("422" on login covers wrong username, email or password alike, so nobody can use the form to find out which accounts exist.)
export function getAuthErrorMessage(kind: "login" | "register", status: number | "network"): string {
    if (status === "network") return "We couldn't reach the server. Check your connection and try again.";
    if (status === 400) return "Something you entered isn't in the right format. Please check it and try again.";
    if (status === 429) return "Too many attempts. Please wait a moment and try again.";
    if (kind === "login" && status === 422) {
        return "We couldn't sign you in. Check your username, email and password, then try again.";
    }
    if (kind === "register" && status === 403) {
        return "We couldn't create an account with those details. Try a different username or email.";
    }
    return "Something went wrong on our side. Please try again in a moment.";
}
