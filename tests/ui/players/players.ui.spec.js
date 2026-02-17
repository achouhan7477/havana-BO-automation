import { test, expect } from "@playwright/test";

test("Players page should load", async ({ page }) => {
  // 1️⃣ Go to players page
  await page.goto("/en/players", { waitUntil: "networkidle" });

  // 2️⃣ URL assertion (most reliable)
  await expect(page).toHaveURL(/\/en\/players/i);

  // 3️⃣ Wait for table OR list (core UI element)
  await page.waitForSelector("table, [role='table']", {
    timeout: 15000,
  });

  // 4️⃣ At least one row exists
  const rows = await page.locator("table tbody tr");
  await expect(rows.first()).toBeVisible();
});
