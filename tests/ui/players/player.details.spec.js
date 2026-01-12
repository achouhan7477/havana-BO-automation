import { test, expect } from "@playwright/test";

test.describe("Player Details Page", () => {

  // -------------------------------------------
  // SAFE PAGE LOAD (React + API stable)
  // -------------------------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/player-details/290", { waitUntil: "domcontentloaded" });

    // wait until React + API finish
    await page.waitForLoadState("networkidle");

    // Real UI anchor — wallet appears only when page is ready
    await expect(page.getByText("Wallet", { exact: true })).toBeVisible({
      timeout: 30000
    });
  });

  // -------------------------------------------
  // BASIC PAGE VALIDATION
  // -------------------------------------------
  test("should load player profile and wallet", async ({ page }) => {
    const playerName = page.getByRole("heading").first();
    await expect(playerName).toBeVisible();
    await expect(page.getByText("Wallet")).toBeVisible();
  });

  // -------------------------------------------
  // TOP ACTION BUTTONS (ALL)
  // -------------------------------------------
  test("should click all top action buttons", async ({ page }) => {

    const clickAndClose = async (name) => {
      const btn = page.getByRole("button", { name });

      if (await btn.count() > 0) {
        await btn.first().scrollIntoViewIfNeeded();
        await btn.first().click({ force: true });
        await page.waitForTimeout(800);
        await page.keyboard.press("Escape");
      } else {
        console.log(`⚠️ ${name} button not found`);
      }
    };

    await clickAndClose(/edit/i);
    await clickAndClose(/active|inactive/i);
    await clickAndClose(/mark as internal|remove as internal/i);
    await clickAndClose(/verified email|not verified email/i);
    await clickAndClose(/kyc/i);
    await clickAndClose(/more actions/i);
  });

  // -------------------------------------------
  // WALLET BUTTONS
  // -------------------------------------------
  test("should click wallet buttons", async ({ page }) => {

    const walletBtn = async (name) => {
      const btn = page.getByRole("button", { name });

      if (await btn.count() > 0) {
        await btn.first().scrollIntoViewIfNeeded();
        await btn.first().click({ force: true });
        await page.waitForTimeout(800);
        await page.keyboard.press("Escape");
      } else {
        console.log(`⚠️ ${name} button not visible for this player`);
      }
    };

    await walletBtn(/purchase/i);
    await walletBtn(/redeem/i);
    await walletBtn(/logout/i);
  });

  // -------------------------------------------
  // PLAYER TABS (RADIX SAFE)
  // -------------------------------------------
  test("should open all player tabs", async ({ page }) => {

    const tabs = [
      "Details",
      "Transactions",
      "Referred Users",
      "Duplicates",
      "Comment",
      "Bet History",
      "Tier Progress",
      "Callback Report"
    ];

    for (const tab of tabs) {
      const tabBtn = page.getByRole("tab", { name: tab });

      if (await tabBtn.count() > 0) {
        await tabBtn.scrollIntoViewIfNeeded();
        await tabBtn.click();
        await page.waitForTimeout(1200);

        // Radix UI active state
        await expect(tabBtn).toHaveAttribute("data-state", /active|selected/i);
      } else {
        console.log(`⚠️ ${tab} tab not found`);
      }
    }
  });

});
