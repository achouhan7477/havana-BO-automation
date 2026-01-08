import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // ✅ Correct ignore paths (relative to testDir)
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
    headless: false,
    slowMo: 500,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },
});
