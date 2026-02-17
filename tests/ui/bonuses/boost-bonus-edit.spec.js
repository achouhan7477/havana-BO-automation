import { test, expect } from "@playwright/test";
// import { typeWithDelay } from "../../../utils/typeWithDelay";

import { typeWithDelay } from "../../../src/utils/typeWithDelay";

test.describe("Bonus Management - Edit Boost Bonus", () => {

  // ----------------------------------
  // SAFE PAGE LOAD
  // ----------------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/bonus", { waitUntil: "domcontentloaded" });

    await expect(
      page.locator("text=Bonus").first()
    ).toBeVisible({ timeout: 30000 });
  });

  // ----------------------------------
  // OPEN EDIT BOOST BONUS
  // ----------------------------------
  test("should open Edit Boost Bonus page", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await expect(boostRow).toBeVisible();

    const editBtn = boostRow.locator("button svg").nth(1);
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click({ force: true });

    await expect(
      page.getByText("Edit Boost Bonus", { exact: true })
    ).toBeVisible();
  });

  // ----------------------------------
  // EDIT BOOST BONUS FORM
  // ----------------------------------
  test("should edit boost bonus form fields", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();

    await page.getByText("Select Days").scrollIntoViewIfNeeded();

    await page.getByLabel("Thursday").check({ force: true });
    await page.getByLabel("Friday").check({ force: true });

    const percentInputs = page.locator("input[type='number']");

    await typeWithDelay(percentInputs.nth(0), "25", 250);
    await typeWithDelay(percentInputs.nth(1), "50", 250);

    await page.getByRole("button", { name: "Submit" }).click({ force: true });

    await expect(
      page.locator(".toast, [role='status']")
    ).toBeVisible({ timeout: 10000 });
  });

  // ----------------------------------
  // VALIDATION – EMPTY PERCENTAGE
  // ----------------------------------
  test("should show validation error for empty percentage", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    const percent = page.locator("input[type='number']").first();

    await percent.click();
    await percent.press("Control+A");
    await percent.press("Backspace");

    await page.getByRole("button", { name: "Submit" }).click({ force: true });

    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();
  });

  // ----------------------------------
  // VALIDATION – % OUT OF RANGE
  // ----------------------------------
  test("should block percentage 0 and >100", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    const percent = page.locator("input[type='number']").first();
    const submitBtn = page.getByRole("button", { name: "Submit" });

    await typeWithDelay(percent, "0", 200);
    await submitBtn.click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();

    await typeWithDelay(percent, "101", 200);
    await submitBtn.click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();
  });

  // ----------------------------------
  // VALIDATION – DAY SELECTION
  // ----------------------------------
  test("should require at least one day selection", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await page.getByLabel("Thursday").uncheck({ force: true });
    await page.getByLabel("Friday").uncheck({ force: true });
    await page.getByLabel("Saturday").uncheck({ force: true });

    await page.getByRole("button", { name: "Submit" }).click({ force: true });

    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();
  });

  // ----------------------------------
  // VALIDATION – MAX BONUS LIMIT
  // ----------------------------------
  test("should validate Max Bonus Limit empty and invalid", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    const maxLimit = page.locator("input[type='number']").nth(1);

    await maxLimit.click();
    await maxLimit.press("Control+A");
    await maxLimit.press("Backspace");

    await page.getByRole("button", { name: "Submit" }).click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();

    await typeWithDelay(maxLimit, "-10", 200);
    await page.getByRole("button", { name: "Submit" }).click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();
  });

  // ----------------------------------
  // FORM BEHAVIOUR – REFRESH
  // ----------------------------------
  test("should not save changes on refresh without submit", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    const percent = page.locator("input[type='number']").first();

    await typeWithDelay(percent, "99", 200);

    await page.reload();

    await boostRow.locator("button svg").nth(1).click({ force: true });

    await expect(percent).not.toHaveValue("99");
  });

  // ----------------------------------
  // STABILITY – MULTIPLE SUBMIT
  // ----------------------------------
  test("should handle multiple submit clicks safely", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await page.getByLabel("Thursday").check({ force: true });

    const percent = page.locator("input[type='number']").first();
    await typeWithDelay(percent, "30", 200);

    const submitBtn = page.getByRole("button", { name: "Submit" });

    await submitBtn.click({ force: true });
    await submitBtn.click({ force: true });

    await expect(
      page.locator(".toast, [role='status']")
    ).toBeVisible();
  });

});