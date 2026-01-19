// import { test, expect } from "@playwright/test";

// test.describe("Dashboard Page", () => {

//   test.beforeEach(async ({ page }) => {
//     await page.goto("/en/dashboard", { waitUntil: "networkidle" });

//     // Dashboard loaded
//     await page.getByRole("heading", { name: "Dashboard" }).waitFor();

//     // Main KPI loaded
//     await page.getByText("Registered Users", { exact: true }).waitFor();
//   });

//   // -------------------------
//   // DATE FILTERS
//   // -------------------------
//   test("should click date filters", async ({ page }) => {
//     const filterBar = page.locator("div").filter({ hasText: "Today" }).first();

//     await filterBar.getByRole("button", { name: "Today" }).click();
//     await filterBar.getByRole("button", { name: "Yesterday" }).click();
//     await filterBar.getByRole("button", { name: "This Week" }).click();
//     await filterBar.getByRole("button", { name: "Pick a date" }).click();
//   });

//   // -------------------------
//   // REPORT CARDS
//   // -------------------------
//   test("should show all report cards", async ({ page }) => {
//     const reports = page.locator("section").filter({ hasText: "Reports" });

//     const cards = [
//       "Registered Users",
//       "Total GGR",
//       "SC Wagered Coin",
//       "SC Won Coin",
//       "Purchase Amount",
//       "Purchase Coin",
//       "SC Redeem Amount",
//       "SC Bonus Coin",
//       "Admin Purchase Coin",
//       "Admin Redeem Coin"
//     ];

//     for (const card of cards) {
//       await expect(reports.getByText(card, { exact: true })).toBeVisible();
//     }
//   });

//   // -------------------------
//   // REAL TIME ACTIVITY
//   // -------------------------
//   test("should show real time activity widgets", async ({ page }) => {
//     const rt = page.getByText("Real-Time Activity").locator("..");

//     await expect(rt.getByText("Online Players")).toBeVisible();
//     await expect(rt.getByText("Total Winnings")).toBeVisible();
//     await expect(rt.getByText("Active Wagers")).toBeVisible();
//     await expect(rt.getByText("Pending Withdrawals")).toBeVisible();
//   });

//   // -------------------------
//   // TOP PERFORMING TABS
//   // -------------------------
//   test("should switch Top Performing tabs", async ({ page }) => {
//     const tabs = page.getByRole("tablist");

//     await tabs.getByRole("tab", { name: "Game" }).click();
//     await tabs.getByRole("tab", { name: "Provider" }).click();
//   });

//   // -------------------------
//   // SWEEP COINS
//   // -------------------------
//   test("should show sweep coin cards", async ({ page }) => {
//     const sweep = page.getByText("Sweep Coins Management").locator("..");

//     await expect(sweep.getByText("Total Issued")).toBeVisible();
//     await expect(sweep.getByText("In Circulation")).toBeVisible();
//     await expect(sweep.getByText("Redemption Rate")).toBeVisible();
//     await expect(sweep.getByText("Conversion Rate")).toBeVisible();
//   });

//   // -------------------------
//   // FINANCIAL ACTIVITY
//   // -------------------------
//   test("should show financial activity chart", async ({ page }) => {
//     const chart = page.getByText("Financial Activity").locator("..");

//     await expect(chart.getByText("Deposits")).toBeVisible();
//     await expect(chart.getByText("Withdrawals", { exact: true })).toBeVisible();
//   });

//   // -------------------------
//   // KYC STATUS
//   // -------------------------
//   test("should show KYC status", async ({ page }) => {
//     await expect(page.getByText("KYC Status")).toBeVisible();
//   });

//   // -------------------------
//   // TOP PLAYERS TABLE
//   // -------------------------
//   test("should load top players table", async ({ page }) => {
//     const section = page.getByText("Top Players").locator("..");

//     await expect(section.getByRole("table")).toBeVisible();
//   });

//   // -------------------------
//   // REFERRAL SYSTEM
//   // -------------------------
//   test("should show referral system", async ({ page }) => {
//     const referral = page.getByText("Referral System").locator("..");

//     await expect(referral.getByText("Total Referrals")).toBeVisible();
//     await expect(referral.getByText("Active Players")).toBeVisible();
//     await expect(referral.getByText("Total Bonuses")).toBeVisible();
//   });

// });
