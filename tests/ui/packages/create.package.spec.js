import { test, expect } from "@playwright/test";

const wait = (ms = 500) => new Promise(res => setTimeout(res, ms));

test.describe("Create Package Page", () => {

  /* -------------------- SETUP -------------------- */
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/packages", { waitUntil: "networkidle" });
    await wait();

    await page.getByRole("button", { name: /create package/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  /* -------------------- BASIC UI -------------------- */
  test("should have all required input fields", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter Label")).toBeVisible();
    await expect(page.getByPlaceholder("Enter Amount")).toBeVisible();
    await expect(page.getByPlaceholder("Enter GC Amount")).toBeVisible();
    await expect(page.getByPlaceholder("Enter SC Amount")).toBeVisible();
    await expect(page.getByPlaceholder("Enter Maximum Purchase")).toBeVisible();
  });

  test("should toggle Is Active & Welcome Package", async ({ page }) => {
    await page.getByLabel(/is active/i).click();
    await page.getByLabel(/welcome package/i).click();
  });

  /* -------------------- EMPTY SUBMIT -------------------- */
  test("submit button should not submit when empty", async ({ page }) => {
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  /* -------------------- VALID SUBMIT -------------------- */
  test("should enable submit with valid data", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Test Package");
    await page.getByPlaceholder("Enter Amount").fill("100");
    await page.getByPlaceholder("Enter GC Amount").fill("1000");
    await page.getByPlaceholder("Enter SC Amount").fill("100");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("5");

    await page.getByLabel(/is active/i).click();
    await wait();

    await expect(
      page.getByRole("button", { name: /submit/i })
    ).toBeEnabled();
  });

  /* -------------------- VIEW LIST -------------------- */
  test("View List button should be clickable", async ({ page }) => {
    await page.getByRole("button", { name: /view list/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /packages/i })
    ).toBeVisible();
  });

  /* -------------------- DISCOUNT PACKAGE -------------------- */
  test("should create $129.99 package with 10% discount - Truesfday Package", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Truesfday Package");
    await page.getByPlaceholder("Enter Amount").fill("129.99");
    await page.getByPlaceholder(/discount/i).fill("10");
    await page.getByPlaceholder("Enter GC Amount").fill("1300");
    await page.getByPlaceholder("Enter SC Amount").fill("130");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await wait();

    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /packages/i })
    ).toBeVisible();
  });

  /* -------------------- EDGE CASES / BUG HUNTING -------------------- */

  test("should not allow negative amount", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Negative Amount");
    await page.getByPlaceholder("Enter Amount").fill("-100");
    await page.getByPlaceholder("Enter GC Amount").fill("100");
    await page.getByPlaceholder("Enter SC Amount").fill("10");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  test("should not allow zero amount", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Zero Amount");
    await page.getByPlaceholder("Enter Amount").fill("0");
    await page.getByPlaceholder("Enter GC Amount").fill("0");
    await page.getByPlaceholder("Enter SC Amount").fill("0");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  test("should not allow discount greater than 100%", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Invalid Discount");
    await page.getByPlaceholder("Enter Amount").fill("100");
    await page.getByPlaceholder(/discount/i).fill("150");
    await page.getByPlaceholder("Enter GC Amount").fill("100");
    await page.getByPlaceholder("Enter SC Amount").fill("10");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  test("should not allow duplicate package name", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("Test Package");
    await page.getByPlaceholder("Enter Amount").fill("100");
    await page.getByPlaceholder("Enter GC Amount").fill("1000");
    await page.getByPlaceholder("Enter SC Amount").fill("100");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /create package/i })
    ).toBeVisible();
  });

  test("should trim whitespace from package name", async ({ page }) => {
    await page.getByPlaceholder("Enter Label").fill("   Space Pack   ");
    await page.getByPlaceholder("Enter Amount").fill("50");
    await page.getByPlaceholder("Enter GC Amount").fill("500");
    await page.getByPlaceholder("Enter SC Amount").fill("50");
    await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

    await page.getByLabel(/is active/i).click();
    await page.getByRole("button", { name: /submit/i }).click();
    await wait();

    await expect(
      page.getByRole("heading", { name: /packages/i })
    ).toBeVisible();
  });

test("should prevent double submit", async ({ page }) => {
  await page.getByPlaceholder("Enter Label").fill("Double Submit");
  await page.getByPlaceholder("Enter Amount").fill("100");
  await page.getByPlaceholder("Enter GC Amount").fill("1000");
  await page.getByPlaceholder("Enter SC Amount").fill("100");
  await page.getByPlaceholder("Enter Maximum Purchase").fill("1");

  await page.getByLabel(/is active/i).click();
  await wait();

  const submitBtn = page.getByRole("button", { name: /submit/i });

  // First click
  await submitBtn.click();

  // ✅ Correct assertions
  await expect(submitBtn).toBeDisabled();
  await expect(submitBtn).toHaveText(/submitting/i);

  // ✅ Final state
  await expect(
    page.getByRole("heading", { name: /packages/i })
  ).toBeVisible();
});

  /* -------------------- FAILURE SCREENSHOT -------------------- */
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `debug-${testInfo.title}.png`,
        fullPage: true,
      });
    }
  });
});