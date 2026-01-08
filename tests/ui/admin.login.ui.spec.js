import { test, expect } from "@playwright/test";

test("BO Admin Login via UI (ENTER submit)", async ({ page }) => {
  // 1️⃣ Open login page
  await page.goto("/en/auth/login", { waitUntil: "networkidle" });

  // 2️⃣ Email
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', "superadmin@trueigtech.com");

  // 3️⃣ Password
  await page.waitForSelector('input[name="password"]', { timeout: 15000 });
  await page.fill('input[name="password"]', "admin");

  // 4️⃣ PRESS ENTER instead of clicking button
  await page.keyboard.press("Enter");

  // 5️⃣ Wait for redirect (dashboard / players / summary)
  await page.waitForURL(/dashboard|players|summary/i, {
    timeout: 20000,
  });

  // 6️⃣ Final assertion
  expect(page.url()).toMatch(/dashboard|players|summary/i);

await page.context().storageState({ path: "auth.json" });

});

