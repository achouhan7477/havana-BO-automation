import { test, expect } from "@playwright/test";

test.describe("Transaction Banking Report", () => {

  // -------------------------------
  // 🔹 BEFORE EACH (STABLE)
  // -------------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/transaction-banking", {
      waitUntil: "domcontentloaded",
      timeout: 45000
    });

    await expect(
      page.getByRole("heading", { name: /transaction banking/i })
    ).toBeVisible({ timeout: 20000 });

    await page.waitForTimeout(1500);
  });

  // -------------------------------
  // 1️⃣ PAGE LOAD
  // -------------------------------
  test("should load transaction banking page", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
  });

  // -------------------------------
  // 2️⃣ STATUS FILTER
  // -------------------------------
  test("should filter by status", async ({ page }) => {
    await page.getByRole("button", { name: /filters/i }).click();

    const statusDropdown = page
      .locator("label:has-text('Search by Status')")
      .locator("..")
      .locator("button");

    await statusDropdown.click();
    await page.getByRole("option", { name: "Failed", exact: true }).click();

    await page.waitForTimeout(4000);

    const rows = await page.locator("table tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  // -------------------------------
  // 3️⃣ TRANSACTION ID FILTER
  // -------------------------------
  test("should filter by transaction id", async ({ page }) => {
    await page.getByRole("button", { name: /filters/i }).click();

    const txnId = "1776";
    await page.getByPlaceholder("Search by Transaction Id").fill(txnId);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);

    await expect(
      page.locator("table tbody tr td").filter({ hasText: txnId }).first()
    ).toBeVisible();
  });

  // -------------------------------
  // 4️⃣ DATE FILTER (RADIX SAFE)
  // -------------------------------
  test.skip("should apply date filter", async ({ page }) => {
    await page.getByRole("button", { name: /filters/i }).click();
    await page.waitForTimeout(1500);

    // 🔥 Click calendar button (NOT input)
    const calendarBtn = page
      .locator('button[aria-haspopup="dialog"]')
      .last();

    await calendarBtn.scrollIntoViewIfNeeded();
    await calendarBtn.click({ force: true });

    await page.waitForTimeout(1500);

    // 🔥 Select TODAY safely
    const todayCell = page
      .locator('[role="gridcell"][aria-current="date"]')
      .first();

    await todayCell.click({ force: true });

    await page.waitForTimeout(4000);

    const rows = await page.locator("table tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  // -------------------------------
  // 5️⃣ MULTIPLE FILTERS (NO DATE)
  // -------------------------------
  test("should apply all filters together except date", async ({ page }) => {
    await page.getByRole("button", { name: /filters/i }).click();

    // Status
    const status = page
      .locator("label:has-text('Search by Status')")
      .locator("..")
      .locator("button");

    await status.click();
    await page.getByRole("option", { name: "Failed", exact: true }).click();

    // Payment Provider
    const provider = page
      .locator("label:has-text('Search by Payment Provider')")
      .locator("..")
      .locator("button");

    await provider.click();
    await page.getByRole("option", { name: "FYNTEK", exact: true }).click();

    // Purpose
    const purpose = page
      .locator("label:has-text('Select Purpose')")
      .locator("..")
      .locator("button");

    await purpose.click();
    await page.getByRole("option", {
      name: /^Purchase$/,
      exact: true
    }).click();

    await page.waitForTimeout(3000);

    const rows = await page.locator("table tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  // -------------------------------
  // 6️⃣ CLEAR ALL FILTERS
  // -------------------------------
  test("should clear all filters", async ({ page }) => {
    await page.getByRole("button", { name: /filters/i }).click();
    await page.getByRole("button", { name: /clear all/i }).click();

    await page.waitForTimeout(4000);

    const rows = await page.locator("table tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  // -------------------------------
  // 7️⃣ PAGINATION
  // -------------------------------
  test("should paginate results", async ({ page }) => {
  const page2 = page
    .locator("button")
    .filter({ hasText: /^2$/ })
    .first();

  await page2.click();
  await page.waitForTimeout(3000);

  // ✅ Correct assertion
  await expect(page2).toHaveClass(/bg-primary/);

  const rows = await page.locator("table tbody tr").count();
  expect(rows).toBeGreaterThan(0);
});


});
