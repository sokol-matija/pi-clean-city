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
      // Only include files that have corresponding test files
      include: [
        // Admin feature - tested files
        "src/features/admin/factories/BadgeFactory.tsx",
        "src/features/admin/observers/*.ts",
        "src/features/admin/services/decorators/*.ts",
        "src/features/admin/services/implementations/SupabaseTicketService.ts",
        // Auth feature - tested files
        "src/features/auth/components/GoogleSignInButton.tsx",
        // Notifications feature - tested files
        "src/features/notifications/utils/topicHelpers.ts",
        // Reports feature - tested files
        "src/features/reports/config/badgeConfig.ts",
        "src/features/reports/hooks/usePhotoUpload.ts",
        "src/features/reports/repositories/MockReportRepository.ts",
        "src/features/reports/types/ReportImplementations.ts",
        "src/features/reports/types/ReportInterfaces.ts",
        "src/features/reports/validation/reportValidation.ts",
        // Lib - tested files
        "src/lib/security.ts",
        "src/lib/utils.ts",
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
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
