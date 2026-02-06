import { expect, test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test("reader route passes basic a11y checks", async ({ page }) => {
  await page.goto("/read/moby-dick");
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });

  await expect(page).toHaveURL(/\/read\/moby-dick/);
});
