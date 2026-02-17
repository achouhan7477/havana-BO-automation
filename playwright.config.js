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

  reporter: [
    ['list'],
    ['html', { open: isCI ? 'never' : 'always' }]
  ],

  use: {
    baseURL: "https://bo-dev.havanafortuna.com",
    storageState: "auth.json",
    browserName: "chromium",

    headless: isCI,

    launchOptions: {
      slowMo: isCI ? 0 : 800
    },

    viewport: { width: 1440, height: 900 },
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,

    // 🔥 ADD THESE FOR FAILURE DEBUGGING
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  workers: isCI ? 4 : 1,
  fullyParallel: true,
  retries: isCI ? 2 : 0,
});