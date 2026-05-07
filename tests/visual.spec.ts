import { test, expect } from "@playwright/test";

const ROUTES = [
  { name: "home", path: "/", heading: "Noah Wright" },
  { name: "projects", path: "/projects", heading: "Projects" },
  { name: "about", path: "/about", heading: "About" },
  { name: "contact", path: "/contact", heading: "Get in Touch" },
  { name: "history", path: "/history", heading: "History" },
];

for (const route of ROUTES) {
  test.describe(route.name, () => {
    test("full page screenshot", async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.ok()).toBeTruthy();
      // Wait for load, then give the ClientWrapper dynamic import time to hydrate.
      await page.waitForLoadState("load");
      await page.waitForTimeout(800);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        // Allow a small pixel tolerance for sub-pixel font rendering differences.
        maxDiffPixelRatio: 0.02,
      });
    });

    test("no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));
      const response = await page.goto(route.path);
      expect(response?.ok()).toBeTruthy();
      await page.waitForLoadState("load");
      await page.waitForTimeout(800);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      expect(errors).toHaveLength(0);
    });
  });
}
