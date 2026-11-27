import { expect, test, type Locator, type Page } from "@playwright/test";

// Use keyboard Tab navigation instead of focusing targets programmatically.
async function tabTo(page: Page, target: Locator, webkit: boolean) {
  for (let index = 0; index < 60; index += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    // On macOS, Safari uses Option-Tab to include non-text controls.
    await page.keyboard.press(webkit ? "Alt+Tab" : "Tab");
  }
  throw new Error("Target could not be reached with the keyboard");
}

test("keyboard sign-in and workspace navigation show visible focus", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  const email = page.getByLabel("Email");
  const password = page.getByLabel("Password", { exact: true });
  const signIn = page.getByRole("button", { name: "Sign in" });
  await tabTo(page, email, browserName === "webkit" && process.platform === "darwin");
  await page.keyboard.type("demo@monolith.local");
  await tabTo(page, password, browserName === "webkit" && process.platform === "darwin");
  await page.keyboard.type("monolith-demo");
  await tabTo(page, signIn, browserName === "webkit" && process.platform === "darwin");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "Command Center", exact: true })).toBeVisible();
  const board = page.getByRole("navigation", { name: "Workspace" }).getByRole("link", { name: "Board", exact: true });
  await tabTo(page, board, browserName === "webkit" && process.platform === "darwin");
  await expect(board).toBeFocused();
  await expect(board).toHaveCSS("outline-style", "solid");
  await expect(board).not.toHaveCSS("outline-width", "0px");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Board", exact: true })).toBeVisible();
  await expect(page.locator("[data-motion-route]")).toHaveCSS("transform", "none");
});
