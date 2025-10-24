import { test, expect } from "@playwright/test";

test.describe("Auth page", () => {
  test("should render sign in form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
