import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/"
      ]
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
