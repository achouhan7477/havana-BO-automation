import { defineConfig } from "@playwright/test";

export default defineConfig({
  // globalSetup: "./global-setup.js",

  use: {
    baseURL: "https://bo-dev.havanafortuna.com",
    storageState: "auth.json",
    browserName: "chromium",
    headless: false,
    slowMo: 500,               // 🔥 UI slow dikhe
    viewport: { width: 1440, height: 900 },
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },
});
