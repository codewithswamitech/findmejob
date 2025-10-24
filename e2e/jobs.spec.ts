import { test, expect } from "@playwright/test";

test.describe("Jobs page", () => {
  test("should redirect to auth when not logged in", async ({ page }) => {
    await page.goto("/app/jobs");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("should render marketing page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /find your next/i })
    ).toBeVisible();
  });
});
