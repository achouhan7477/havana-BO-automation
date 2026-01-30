import { test, expect } from "@playwright/test";

test.describe("Bonus Management - Edit Boost Bonus", () => {

  // ----------------------------------
  // SAFE PAGE LOAD
  // ----------------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/bonus", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

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
    ).toBeVisible({ timeout: 30000 });
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
    await percentInputs.nth(0).fill("25");
    await percentInputs.nth(1).fill("50");

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

    await page.locator("input[type='number']").first().fill("");
    await page.getByRole("button", { name: "Submit" }).click({ force: true });

    await expect(
      page.getByText("Edit Boost Bonus")
    ).toBeVisible();
  });

  // ----------------------------------
  // VALIDATION – % OUT OF RANGE
  // ----------------------------------
  test("should block percentage 0 and >100", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    const percent = page.locator("input[type='number']").first();
    const submitBtn = page.getByRole("button", { name: "Submit" });

    await percent.fill("0");
    await submitBtn.click({ force: true });

    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();

    await percent.fill("101");
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

    await expect(
      page.getByText("Edit Boost Bonus")
    ).toBeVisible();
  });

  // ----------------------------------
  // VALIDATION – MAX BONUS LIMIT
  // ----------------------------------
  test("should validate Max Bonus Limit empty and invalid", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    // 2nd number input = Max Bonus Limit (label not reliable)
    const maxLimit = page.locator("input[type='number']").nth(1);

    await maxLimit.fill("");
    await page.getByRole("button", { name: "Submit" }).click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();

    await maxLimit.fill("-10");
    await page.getByRole("button", { name: "Submit" }).click({ force: true });
    await expect(page.getByText("Edit Boost Bonus")).toBeVisible();
  });

  // ----------------------------------
  // LANGUAGE TAB – DATA RETENTION
  // ----------------------------------
  // test("should retain EN data when switching language tabs", async ({ page }) => {
  //   const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
  //   await boostRow.locator("button svg").nth(1).click({ force: true });

  //   const enInput = page.locator("input[name*='en']");
  //   await enInput.waitFor();
  //   await enInput.fill("Boost Bonus EN");

  //   await page.getByText("ES").click();
45
  //   const esInput = page.locator("input[name*='es']");
  //   await esInput.waitFor();
  //   await esInput.fill("Boost Bonus ES");

  //   await page.getByText("EN").click();
  //   await expect(enInput).toHaveValue("Boost Bonus EN");
  // });

  // ----------------------------------
  // FORM BEHAVIOUR – REFRESH
  // ----------------------------------
  test("should not save changes on refresh without submit", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await page.locator("input[type='number']").first().fill("99");

    await page.reload();

    // reopen edit
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await expect(
      page.locator("input[type='number']").first()
    ).not.toHaveValue("99");
  });

  // ----------------------------------
  // STABILITY – MULTIPLE SUBMIT
  // ----------------------------------
  test("should handle multiple submit clicks safely", async ({ page }) => {
    const boostRow = page.locator("tr", { hasText: "Boost Bonus" });
    await boostRow.locator("button svg").nth(1).click({ force: true });

    await page.getByLabel("Thursday").check({ force: true });
    await page.locator("input[type='number']").first().fill("30");

    const submitBtn = page.getByRole("button", { name: "Submit" });

    await submitBtn.click({ force: true });
    await submitBtn.click({ force: true });

    await expect(
      page.locator(".toast, [role='status']")
    ).toBeVisible();
  });

});
