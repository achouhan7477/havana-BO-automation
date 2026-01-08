import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // 🔴 Ignore Jest-style / API tests
  testIgnore: [
    "**/tests/auth/**",
    "**/tests/bonus/**",
    "**/tests/games/**",
    "**/tests/users/**",
    "**/tests/wallet/**",
  ],

  // globalSetup: "./global-setup.js",

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
