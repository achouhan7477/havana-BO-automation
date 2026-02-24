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

    // Headless only in CI
    headless: isCI,

    // 🔥 LOCAL = MAXIMIZED | CI = FIXED VIEWPORT
    viewport: isCI ? { width: 1440, height: 900 } : null,

    launchOptions: {
      slowMo: isCI ? 0 : 800,

      // 🔥 Required for maximize in Playwright
      args: isCI ? [] : ['--start-maximized']
    },

    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,

    // Failure debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  workers: isCI ? 4 : 1,
  fullyParallel: true,
  retries: isCI ? 2 : 0,
});