import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

// Production smoke tests require the explicit safeguards documented in
// docs/production-smoke.md. Never use real user accounts or real project IDs.
test.skip(
  process.env.MONOLITH_SMOKE !== "1",
  "Production smoke requires MONOLITH_SMOKE=1 and disposable-account configuration.",
);
// Failure artifacts can capture credentials or private account data.
test.use({ trace: "off", screenshot: "off", video: "off" });

type SmokeConfig = { origin: string; email: string; password: string };
let config: SmokeConfig;

function required(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Production smoke requires ${name}.`);
  return value;
}

test.beforeAll(() => {
  const base = new URL(required("PLAYWRIGHT_BASE_URL"));
  const allowed = new URL(required("SMOKE_ALLOWED_ORIGIN"));
  if (
    base.origin !== allowed.origin ||
    base.pathname !== "/" ||
    allowed.pathname !== "/" ||
    base.search ||
    allowed.search ||
    base.hash ||
    allowed.hash ||
    base.username ||
    base.password ||
    allowed.username ||
    allowed.password
  ) {
    throw new Error(
      "PLAYWRIGHT_BASE_URL must exactly match the explicitly allowed origin.",
    );
  }
  if (
    base.protocol !== "https:" &&
    !(
      base.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)
    )
  ) {
    throw new Error("Smoke target must use HTTPS unless it is loopback.");
  }
  if (required("SMOKE_DISPOSABLE_ACCOUNT") !== "yes") {
    throw new Error(
      "SMOKE_DISPOSABLE_ACCOUNT must be yes for a dedicated disposable account.",
    );
  }
  config = {
    origin: base.origin,
    email: required("SMOKE_EMAIL"),
    password: required("SMOKE_PASSWORD"),
  };
});

async function signIn(
  page: Page,
  email = config.email,
  password = config.password,
) {
  await page.goto("/login");
  if (new URL(page.url()).origin !== config.origin) {
    throw new Error(
      "Smoke login redirected to an unexpected origin; refusing to enter credentials.",
    );
  }
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Accounts must already be confirmed where email confirmation is enabled.
  await page.waitForURL("**/app");
  if (new URL(page.url()).origin !== config.origin) {
    throw new Error("Smoke sign-in reached an unexpected origin.");
  }
}

async function signOut(page: Page) {
  await page.getByTestId("account-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await page.waitForURL("**/login");
}

test("new disposable account can sign up and be removed when auto-confirm is enabled", async ({
  page,
}) => {
  test.skip(
    process.env.SMOKE_SIGNUP_CONFIRM !== "delete-new-account",
    "Signup requires a separate explicit opt-in and cleanup approval.",
  );
  if (required("SMOKE_SIGNUP_AUTO_CONFIRMED") !== "yes") {
    throw new Error(
      "Automated signup requires confirmed auto-confirm mode; verify confirmation-required signup separately.",
    );
  }
  const domain = required("SMOKE_SIGNUP_EMAIL_DOMAIN");
  if (
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(
      domain,
    )
  ) {
    throw new Error(
      "SMOKE_SIGNUP_EMAIL_DOMAIN must be a valid domain controlled for disposable testing.",
    );
  }
  const email = `monolith-smoke-${randomUUID()}@${domain}`;
  const password = `${randomUUID()}aA1!`;
  console.info(`Disposable signup account: ${email}`);
  let attempted = false;
  try {
    await page.goto("/signup");
    if (new URL(page.url()).origin !== config.origin)
      throw new Error("Signup redirected to an unexpected origin.");
    await page.getByLabel("Name").fill("Smoke test");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    attempted = true;
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/app");
    await expect(page.getByText("No projects yet")).toBeVisible();
    await signOut(page);
    await signIn(page, email, password);
  } finally {
    if (attempted) {
      try {
        if (!new URL(page.url()).pathname.startsWith("/app"))
          await signIn(page, email, password);
        await page.getByTestId("account-menu-trigger").click();
        await page.getByRole("menuitem", { name: "Delete account" }).click();
        const dialog = page.getByRole("alertdialog");
        await expect(dialog.getByText(email, { exact: false })).toBeVisible();
        await dialog.getByRole("button", { name: "Delete forever" }).click();
        await page.waitForURL("**/login?deleted=1");
      } catch {
        throw new Error(
          `Could not clean up signup account ${email}; inspect and remove it manually.`,
        );
      }
    }
  }
});

test("confirmed disposable account signs in and out", async ({ page }) => {
  await signIn(page);
  await expect(
    page.getByRole("heading", { name: "Command Center", exact: true }),
  ).toBeVisible();
  await signOut(page);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});

test("project and task persist across sessions and are cleaned up", async ({
  page,
}) => {
  const suffix = randomUUID();
  const projectName = `Smoke ${suffix}`;
  const taskName = `Smoke task ${suffix}`;
  console.info(`Disposable smoke fixture: ${projectName}`);
  let projectId: string | undefined;
  try {
    await signIn(page);
    await page.getByRole("button", { name: "New project" }).first().click();
    const projectDialog = page.getByRole("dialog");
    await projectDialog.getByLabel("Name").fill(projectName);
    const created = page.waitForResponse(
      (response) =>
        new URL(response.url()).origin === config.origin &&
        new URL(response.url()).pathname === "/api/projects" &&
        response.request().method() === "POST",
    );
    await projectDialog.getByRole("button", { name: "Create project" }).click();
    const response = await created;
    if (!response.ok())
      throw new Error(
        `Smoke project creation failed (HTTP ${response.status()}).`,
      );
    const payload = (await response.json()) as {
      project?: { id?: unknown; name?: unknown };
    };
    if (
      payload.project?.name !== projectName ||
      typeof payload.project?.id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(payload.project.id)
    ) {
      throw new Error(
        `Unexpected project response; inspect the disposable account for ${projectName}.`,
      );
    }
    projectId = payload.project.id;
    await page.goto(`/app/projects/${projectId}`);
    await page.getByRole("button", { name: "Add task" }).first().click();
    const taskDialog = page.getByRole("dialog");
    await taskDialog.getByLabel("Title").fill(taskName);
    await taskDialog.getByRole("button", { name: "Add task" }).click();
    const status = page.getByRole("combobox", {
      name: `Status for ${taskName}`,
    });
    await expect(status).toBeVisible();
    await status.selectOption("in_progress");
    await expect(page.getByText("Moved to In progress.").first()).toBeVisible();
    await page.reload();
    await expect(status).toHaveValue("in_progress");
    await signOut(page);
    await signIn(page);
    await page.goto(`/app/projects/${projectId}`);
    await expect(
      page.getByRole("combobox", { name: `Status for ${taskName}` }),
    ).toHaveValue("in_progress");
  } finally {
    if (projectId) {
      // This ID came exclusively from this test's successfully created project.
      if (!new URL(page.url()).pathname.startsWith("/app")) await signIn(page);
      const cleanup = await page.request.delete(`/api/projects/${projectId}`, {
        headers: { Origin: config.origin },
      });
      if (!cleanup.ok())
        throw new Error(
          `Cleanup failed for disposable project ${projectId} (HTTP ${cleanup.status()}); remove it manually.`,
        );
    }
  }
});

test("separately approved disposable account can be deleted", async ({
  page,
}) => {
  test.skip(
    process.env.SMOKE_DELETE_CONFIRM !== "delete-disposable-account",
    "Account deletion needs its own explicit opt-in and a separate disposable account.",
  );
  const email = required("SMOKE_DELETE_EMAIL");
  const password = required("SMOKE_DELETE_PASSWORD");
  if (email.toLowerCase() === config.email.toLowerCase())
    throw new Error(
      "Deletion account must differ from the core smoke account.",
    );
  await signIn(page, email, password);
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
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
});
