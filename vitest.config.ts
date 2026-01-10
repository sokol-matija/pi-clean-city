import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/**", // Exclude Playwright E2E tests
    ],
    coverage: {
      provider: "v8",
      // Include business logic files - UI components tested via E2E
      include: [
        "src/features/**/hooks/**/*.ts",
        "src/features/**/services/**/*.ts",
        "src/features/**/utils/**/*.ts",
        "src/features/**/validation/**/*.ts",
        "src/features/**/repositories/**/*.ts",
        "src/features/**/patterns/**/*.ts",
        "src/features/**/config/**/*.ts",
        "src/features/**/types/**/*.ts",
        "src/lib/**/*.ts",
      ],
      reporter: ["text", "json", "html", "lcov"],
      reportOnFailure: true,
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.{js,ts}",
        "**/dist/**",
        "**/.{eslint,prettier}rc.{js,cjs,yml}",
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 15,
        functions: 15,
        branches: 15,
        statements: 15,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
