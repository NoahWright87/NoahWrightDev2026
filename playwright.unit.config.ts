import { defineConfig } from "@playwright/test";

// Plain logic tests (no browser, no server): `npm run test:unit`.
export default defineConfig({
  testDir: "./tests/unit",
});
