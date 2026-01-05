import { test, expect } from "@playwright/test"

test.describe("Report Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("user can sign in and view reports on map", async ({ page }) => {
    // Sign in
    await page.getByRole("link", { name: "Sign In", exact: true }).click()
    await expect(page).toHaveURL(/.*login/)

    await page.getByRole("textbox", { name: "Email" }).fill("admin@admin.com")
    await page.getByRole("textbox", { name: "Password" }).fill("admin")
    await page.getByRole("button", { name: "Sign in" }).click()

    // Wait for successful login - should redirect away from login page
    await expect(page).not.toHaveURL(/.*login/)

    // Navigate to map
    await page.getByRole("link", { name: "Map", exact: true }).click()
    await expect(page).toHaveURL(/.*map/)

    // Verify map is loaded (check for leaflet container)
    await expect(page.locator(".leaflet-container")).toBeVisible()
  })
})
