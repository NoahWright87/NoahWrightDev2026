import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotDir: "./tests/__snapshots__",
  // Run against the production build via `next start` for stable snapshots.
  // `npm run test:visual` starts the server automatically.
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
  // Desktop + mobile viewports.
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
        // Disable animations so screenshots are deterministic.
        reducedMotion: "reduce",
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        reducedMotion: "reduce",
      },
    },
  ],
  // Fail fast in CI; allow retries locally to avoid flaky snapshot misses.
  retries: process.env.CI ? 2 : 0,
});
