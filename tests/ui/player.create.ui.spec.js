import { test, expect } from "@playwright/test";

test.use({
  storageState: "auth.json", // reuse admin login
});

test("Admin should create a new player (full flow)", async ({ page }) => {
  // 1️⃣ Open Players page
  await page.goto("/en/players");
  await expect(page).toHaveURL(/\/en\/players/i);

  // 2️⃣ Click Create User
  await page.getByRole("button", { name: /create user/i }).click();

  // 3️⃣ Wait for Create User drawer/form
  await page.waitForSelector('input[name="firstName"]', {
    timeout: 15000,
  });

  // 4️⃣ Generate unique test data
  const id = Date.now();
  const email = `demoplayer${id}@mailinator.com`;
  const username = `boostbonustest${id}`;

  // 5️⃣ Fill basic required fields
  await page.fill('input[name="firstName"]', "demo");
  await page.fill('input[name="lastName"]', "Player");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "Test@12345");

  // 6️⃣ Gender dropdown
  await page.getByText("Select Gender").click();
  await page.getByRole("option", { name: /male|female/i }).first().click();

  // 7️⃣ Phone number
  await page.fill('input[name="phone"]', "9876543210");

  // 8️⃣ Date of Birth (REAL FIX: native date input)
  // HTML: <input type="date" name="dateOfBirth">
  await page.fill('input[name="dateOfBirth"]', "1998-01-08");

  // 9️⃣ Amount
  await page.fill('input[name="amount"]', "0");

  // 🔟 Cashier ID dropdown
  await page.getByText("Enter Cashier ID").click();

  const cashierOption = page.locator('[role="option"]').first();
  await cashierOption.waitFor({ timeout: 10000 });
  await cashierOption.click();

  // 1️⃣1️⃣ Submit form
  await page.getByRole("button", { name: /submit/i }).click();

  // 1️⃣2️⃣ Wait for drawer close + table refresh
  await page.waitForTimeout(3000);

  // 1️⃣3️⃣ VERIFY: new player appears in table (NO SEARCH – STABLE)
  await page.waitForSelector("table tbody tr", {
    timeout: 15000,
  });

  const firstRow = page.locator("table tbody tr").first();
  await expect(firstRow).toContainText(email);
});
