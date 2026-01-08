import { defineConfig } from "@playwright/test";

export default defineConfig({
  // globalSetup: "./global-setup.js",

  use: {
    baseURL: "https://bo-dev.havanafortuna.com",
    storageState: "auth.json",
    browserName: "chromium",
  },
});
