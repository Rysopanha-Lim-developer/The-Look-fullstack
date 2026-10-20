import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
    test: {
        environment: "node",
        include: ["**/*.test.ts"],
        exclude: ["node_modules", ".next"],
        env: {
            JWT_SECRET: "test-access-secret-at-least-32-characters-long",
            REFRESH_TOKEN_SECRET: "test-refresh-secret-at-least-32-characters-long",
        },
        coverage: { provider: "v8", include: ["Backend/lib/**", "Backend/services/**", "Frontend/lib/**"] },
    },
});