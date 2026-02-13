import { test, expect } from "@playwright/test";

test.describe("Packages List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/packages", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", { name: /packages/i })
    ).toBeVisible();
  });

  test("should open Columns dropdown", async ({ page }) => {
    await page.getByRole("button", { name: /columns/i }).click();
    await expect(page.getByRole("menu")).toBeVisible();
  });

  test.skip("should navigate to Create Package page", async ({ page }) => {
    await page.getByRole("button", { name: /create package/i }).click();
    await expect(page).toHaveURL(/create/);
  });

  test.skip("should navigate to Create Special Package page", async ({ page }) => {
    await page.getByRole("button", { name: /create special package/i }).click();
    await expect(page).toHaveURL(/special/);
  });

  test("should click Reorder button", async ({ page }) => {
    await page.getByRole("button", { name: /reorder/i }).click();
    // assert modal / UI reaction if exists
  });

  test.skip("should open edit package", async ({ page }) => {
    const editBtn = page.locator("tbody tr").first().getByRole("button").first();
    await editBtn.click();
    await expect(page).toHaveURL(/edit|update/);
  });

test("should delete package successfully", async ({ page }) => {

  const rowsBefore = await page.locator("tbody tr").count();

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes("/package") &&
      res.request().method() === "DELETE" &&
      res.status() === 200
    ),

    page.locator("tbody tr").first().getByRole("button").nth(1).click()
  ]);

  await page.waitForFunction(
    (prev) => document.querySelectorAll("tbody tr").length < prev,
    rowsBefore
  );

  const rowsAfter = await page.locator("tbody tr").count();
  expect(rowsAfter).toBeLessThan(rowsBefore);
});
});