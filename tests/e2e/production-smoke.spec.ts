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
  await page.getByTestId("account-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await page.waitForURL("**/login");
});

test("account deletion removes the account and its data", async ({ page }) => {
  const email = `prod-del-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Prod Delete");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("delete-password-123");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/app");

  await page.getByRole("button", { name: "New project" }).first().click();
  await page.getByLabel("Name").fill("Doomed project");
  await page.getByRole("button", { name: "Create project" }).click();
  await page.waitForURL("**/app");

  await page.getByTestId("account-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Delete account" }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByText(email, { exact: false })).toBeVisible();
  await dialog.getByRole("button", { name: "Delete forever" }).click();
  await page.waitForURL("**/login?deleted=1");
  await expect(
    page.getByText("Your account and all of its data have been deleted."),
  ).toBeVisible();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("delete-password-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
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

  // Navigate like a user: sidebar link (client-side). A hard goto within a
  // second of the commit can occasionally hit a brief read-propagation
  // window on the database edge, so this follows the real user path and
  // polls briefly.
  await page.getByRole("link", { name: "Projects" }).first().click();
  await page.waitForURL("**/app/projects");
  const projectLink = page.getByRole("link", { name: /Smoke Project/ }).first();
  await expect(projectLink).toBeVisible({ timeout: 15_000 });
  await projectLink.click();
  await page.waitForURL("**/app/projects/**");

  // Create a task inside the project
  await page.getByRole("button", { name: "Add task" }).first().click();
  const taskDialog = page.getByRole("dialog");
  await taskDialog.getByLabel("Title").fill("Smoke task");
  await taskDialog.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByText("Smoke task").first()).toBeVisible();

  // Move its status via the accessible select, verify toast + reload
  const statusSelect = page.getByRole("combobox", { name: "Status for Smoke task" });
  await statusSelect.selectOption("in_progress");
  await expect(page.getByText("Moved to In progress.").first()).toBeVisible();
  await page.reload();
  await expect(statusSelect).toHaveValue("in_progress");

  // Persistence across session
  await page.getByTestId("account-menu-trigger").click();
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
