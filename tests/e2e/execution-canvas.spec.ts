import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

// These fixtures can only be created in the local test stack. Never point this
// test at a production deployment or a real account.
function localClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const base = new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000");
  if (url !== "http://127.0.0.1:54321" || !key || !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) {
    throw new Error("The execution canvas test requires local Supabase and a loopback web server.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function signInSeed(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@monolith.local");
  await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
}

test("execution canvas follows the selected project's real milestones and progress", async ({ page }) => {
  const client = localClient();
  const auth = await client.auth.signInWithPassword({ email: "demo@monolith.local", password: "monolith-demo" });
  if (auth.error || !auth.data.user) throw new Error("Could not sign in local fixture user.");
  const suffix = randomUUID();
  const firstName = `Canvas first ${suffix}`;
  const secondName = `Canvas second ${suffix}`;
  const milestoneName = `Canvas milestone ${suffix}`;
  const inserted = await client.from("projects").insert([
    { owner_id: auth.data.user.id, name: firstName, status: "active" },
    { owner_id: auth.data.user.id, name: secondName, status: "active" },
  ]).select("id,name");
  if (inserted.error || inserted.data?.length !== 2) throw new Error("Could not create fixture projects.");
  const firstId = inserted.data.find((project) => project.name === firstName)!.id;
  const secondId = inserted.data.find((project) => project.name === secondName)!.id;

  try {
    const tasks = await client.from("tasks").insert([
      { project_id: firstId, title: `Finished ${suffix}`, status: "done" },
      { project_id: firstId, title: `Open ${suffix}`, status: "todo" },
      { project_id: secondId, title: `Second project work ${suffix}`, status: "todo" },
    ]);
    const milestones = await client.from("milestones").insert([
      { project_id: firstId, title: milestoneName, target_date: "2030-01-01" },
      { project_id: firstId, title: `Completed milestone ${suffix}`, completed_at: "2026-01-01T00:00:00Z" },
    ]);
    if (tasks.error || milestones.error) throw new Error("Could not create fixture work.");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await signInSeed(page);
    await page.goto(`/app?project=${firstId}`);
    const canvas = page.getByRole("region", { name: "Project execution canvas" });
    await expect(canvas).toBeVisible();
    await expect(canvas.getByText(firstName, { exact: true })).toBeVisible();
    await expect(canvas.getByRole("button", { name: new RegExp(milestoneName) })).toBeVisible();
    // One completed task and one completed milestone out of four total items.
    await expect(canvas.getByText("50%", { exact: true }).first()).toBeVisible();
    const projectNav = page.getByRole("navigation", { name: "Choose an active project" });
    const secondProject = projectNav.locator(`a[href="/app?project=${secondId}"]`);
    await secondProject.focus();
    await expect(secondProject).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(canvas.getByText(secondName, { exact: true })).toBeVisible();
    await expect(canvas.getByRole("button", { name: new RegExp(milestoneName) })).toHaveCount(0);
    await expect(canvas.getByText(/no (upcoming )?milestones?/i)).toBeVisible();
    await expect(canvas.getByText("0%", { exact: true }).first()).toBeVisible();
    await expect(projectNav.locator(`a[href="/app?project=${secondId}"]`)).toHaveAttribute("aria-current", "page");
  } finally {
    const cleanup = await client.from("projects").delete().in("id", [firstId, secondId]);
    if (cleanup.error) throw new Error("Could not clean up the canvas fixture projects.");
  }
});

test("a new account has an honest empty workspace and a project creation action", async ({ page }) => {
  localClient(); // The URL guard applies before signup or cleanup.
  const email = `canvas-empty-${randomUUID()}@example.com`;
  let created = false;
  try {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/signup");
    await page.getByLabel("Name").fill("Canvas empty fixture");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("local-test-password-123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/app");
    created = true;
    await expect(page.getByRole("heading", { name: "No projects yet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create a project" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Project execution canvas" })).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    if (created) {
      await page.getByTestId("account-menu-trigger").click();
      await page.getByRole("menuitem", { name: "Delete account" }).click();
      const dialog = page.getByRole("alertdialog");
      await expect(dialog.getByText(email, { exact: false })).toBeVisible();
      await dialog.getByRole("button", { name: "Delete forever" }).click();
      await page.waitForURL("**/login?deleted=1");
    }
  }
});
