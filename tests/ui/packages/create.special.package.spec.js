import { test, expect } from "@playwright/test";

/* -------------------------------------------------
   Helpers
--------------------------------------------------*/
const wait = (ms = 300) => new Promise(res => setTimeout(res, ms));

const scrollPageDown = async (page, times = 3) => {
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, 1200);
    await wait();
  }
};

const fillInput = async (locator, value) => {
  await locator.click();
  await locator.fill(value);
  await locator.blur();
  await wait();
};

// 🔥 For readonly Flatpickr inputs
const setDateValue = async (page, selector, value) => {
  await page.evaluate(
    ({ selector, value }) => {
      const input = document.querySelector(selector);
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { selector, value }
  );
  await wait();
};

/* -------------------------------------------------
   Test Suite
--------------------------------------------------*/
test.describe("Create Special Package – Full Page Scroll Safe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/packages", { waitUntil: "networkidle" });
    await wait();

    await page
      .getByRole("button", { name: /create special package/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /create special package/i })
    ).toBeVisible();
  });

  test("should fill entire form and enable submit", async ({ page }) => {
    /* -----------------------------
       Top Section
    ------------------------------*/
    await fillInput(page.getByPlaceholder("Enter Label"), "Auto Special Pack");
    await fillInput(page.getByPlaceholder("Enter Card Title"), "Mega Bonus");
    await fillInput(page.getByPlaceholder("Enter Sub Title"), "Limited Offer");
    await fillInput(page.getByPlaceholder("Enter Price"), "9.99");
    await fillInput(page.getByPlaceholder("Enter GC Amount"), "1000");
    await fillInput(page.getByPlaceholder("Enter SC Amount"), "200");

    /* -----------------------------
       Template Dropdown
    ------------------------------*/
    const templateDropdown = page
      .getByRole("combobox")
      .filter({ hasText: /^Select$/ })
      .first();

    await templateDropdown.click();
    await wait();
    await page.getByRole("option", { name: "Daily" }).click();

    /* -----------------------------
       Schedule & Visibility
    ------------------------------*/
    await scrollPageDown(page, 3);

    const scheduleSection = page.getByText("Schedule & Visibility");

    const orderDropdown = scheduleSection
      .locator("..")
      .getByRole("combobox")
      .first();

    await orderDropdown.click();
    await wait();
    await page.getByRole("option", { name: "One-Time" }).click();

    // ✅ Flatpickr (readonly) fields
    await setDateValue(
      page,
      'input[name="startAt"]',
      "2026-02-10 10:00"
    );

    await setDateValue(
      page,
      'input[name="endAt"]',
      "2026-02-20 22:00"
    );

    /* -----------------------------
       Target Audience
    ------------------------------*/
    await scrollPageDown(page, 2);

    await fillInput(
      page.getByPlaceholder("Enter Maximum Purchase Per user"),
      "5"
    );

    await fillInput(
      page.getByPlaceholder("Enter Maximum User Limit"),
      "100"
    );

    /* -----------------------------
       VIP Tier Multi-Select (FIXED)
    ------------------------------*/
    const vipDropdown = page
      .getByRole("combobox")
      .filter({ hasText: /select target vip tier ids/i });

    // Select Gold
    await vipDropdown.click();
    await wait();
    await page.getByRole("option", { name: "Gold" }).click();
    await wait();

    // Re-open and select Platinum
    // await vipDropdown.click();
    // await wait();
    // await page.getByRole("option", { name: "Platinum" }).click();
    // await wait();

    /* -----------------------------
       Is Active Toggle (REAL SWITCH)
    ------------------------------*/
    await scrollPageDown(page, 2);

    const activeSwitch = page.getByRole("switch", { name: /is active/i });
    await activeSwitch.scrollIntoViewIfNeeded();
    await activeSwitch.click();
    await wait();

    /* -----------------------------
       Submit Button
    ------------------------------*/
    const submitBtn = page.getByRole("button", { name: /submit/i });

    await submitBtn.scrollIntoViewIfNeeded();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  });

  /* -----------------------------
     Screenshot on Failure
  ------------------------------*/
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `debug-${testInfo.title}.png`,
        fullPage: true,
      });
    }
  });
});