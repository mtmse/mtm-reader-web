import { expect, test } from "@playwright/test";

test("home redirects to default publication", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/read\/moby-dick/);
});
