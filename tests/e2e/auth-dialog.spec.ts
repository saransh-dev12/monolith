import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("landing authentication dialog supports switching, keyboard and focus return", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("link", { name: "Start a project", exact: true }).first();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Create your workspace" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Name")).toBeFocused();
  expect((await new AxeBuilder({ page }).include('[role="dialog"]').analyze()).violations).toEqual([]);
  await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
  const login = page.getByRole("dialog", { name: "Welcome back" });
  await expect(login.getByLabel("Email")).toBeFocused();
  await expect(login.getByLabel("Password", { exact: true })).toHaveAttribute("autocomplete", "current-password");
  await login.getByRole("button", { name: "Show password" }).click();
  await expect(login.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await login.getByRole("button", { name: "Hide password" }).click();
  await expect(login.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password");
  await page.keyboard.press("Escape");
  await expect(login).toBeHidden();
  await expect(opener).toBeFocused();
});

test("sign-in dialog fits a mobile screen and retains direct auth routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in to explore" }).click();
  const dialog = page.getByRole("dialog", { name: "Welcome back" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
