import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  // ignore API / jest-style tests
  testIgnore: [
    "auth/**",
    "bonus/**",
    "games/**",
    "users/**",
    "wallet/**",
  ],

  use: {
    baseURL: "https://bo-dev.havanafortuna.com",
    storageState: "auth.json",
    browserName: "chromium",

    // 🔥 THIS IS THE FIX
    headless: isCI ? true : false,
    slowMo: isCI ? 0 : 500,

    viewport: { width: 1440, height: 900 },
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },
});
