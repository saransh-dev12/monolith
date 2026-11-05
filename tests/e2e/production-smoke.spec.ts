import { expect, test } from "@playwright/test";

// Production smoke test. Runs only when explicitly invoked:
//   SMOKE_EMAIL=you+smoke@example.com PLAYWRIGHT_BASE_URL=https://<prod> npx playwright test production-smoke
// Skipped in CI and local default runs so no disposable accounts are
// created against production by accident.
test.skip(!process.env.SMOKE_EMAIL, "production smoke — requires SMOKE_EMAIL");

const password = "smoke-password-123";

test("signup lands in an empty workspace and signs out", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Prod Smoke");
  await page.getByLabel("Email").fill(process.env.SMOKE_EMAIL!);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/app");
  await expect(page.getByText("No projects yet")).toBeVisible();
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await page.waitForURL("**/login");
});

test("confirmed user can work the full core loop", async ({ page }) => {
  // Sign in
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.SMOKE_EMAIL!);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");

  // Create a project
  await page.getByRole("button", { name: "New project" }).first().click();
  await page.getByLabel("Name").fill("Smoke Project");
  await page.getByRole("button", { name: "Create project" }).click();
  await page.waitForURL("**/app");
  await page.goto("/app/projects");
  await page.getByRole("link", { name: /Smoke Project/ }).first().click();
  await page.waitForURL("**/app/projects/**");

  // Create a task inside the project
  await page.getByRole("button", { name: "Add task" }).first().click();
  const taskDialog = page.getByRole("dialog");
  await taskDialog.getByLabel("Title").fill("Smoke task");
  await taskDialog.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByText("Smoke task").first()).toBeVisible();

  // Move its status via the accessible select, verify the real toast + reload
  await page
    .getByRole("combobox", { name: "Status for Smoke task" })
    .selectOption("in-progress");
  await expect(page.getByText("Moved to In progress.").first()).toBeVisible();
  await page.reload();
  await expect(
    page
      .getByRole("combobox", { name: "Status for Smoke task" })
      .locator("option[selected], option:checked")
      .first(),
  ).toHaveText("In progress");

  // Persistence across session
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await page.waitForURL("**/login");
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.SMOKE_EMAIL!);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
  await expect(page.getByText("Smoke Project").first()).toBeVisible();
  await expect(page.getByText("Smoke task").first()).toBeVisible();
});
