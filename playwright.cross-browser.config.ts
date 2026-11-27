import { defineConfig, devices } from "@playwright/test";
import baseConfig from "./playwright.config";

// Run explicitly with: npx playwright test -c playwright.cross-browser.config.ts
// The default suite remains Chromium-only; CI must provision these browsers first.
export default defineConfig({
  ...baseConfig,
  projects: [
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
