import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

loadEnvConfig(process.cwd());

test("project, board, and dashboard include more than 1,000 tasks", async ({ page }) => {
  test.setTimeout(180_000);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  // This test creates and deletes data and is restricted to the local test stack.
  if (url !== "http://127.0.0.1:54321" || !key) throw new Error("Local Supabase test configuration required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const auth = await client.auth.signInWithPassword({ email: "demo@monolith.local", password: "monolith-demo" });
  if (auth.error || !auth.data.user) throw new Error("Could not sign in local test user");
  const baseline = await client.rpc("dashboard_totals");
  if (baseline.error || !baseline.data?.[0]) throw new Error("Could not read baseline totals");
  const name = `Large account fixture ${Date.now()}`;
  const project = await client.from("projects").insert({ owner_id: auth.data.user.id, name }).select("id").single();
  if (project.error || !project.data) throw new Error("Could not create test project");
  const projectId = project.data.id;
  try {
    const rows = Array.from({ length: 1005 }, (_, index) => ({
      project_id: projectId, title: `${name} task ${index}`, position: index,
      status: index < 500 ? "done" : "todo", due_date: "2020-01-01",
    }));
    const inserted = await client.from("tasks").insert(rows);
    if (inserted.error) throw new Error(`Could not create fixture: ${inserted.error.message}`);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password").fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    await expect(page.getByLabel(`Open tasks: ${baseline.data[0].open_tasks + 505}`)).toBeVisible();
    await expect(page.getByLabel(`Completed tasks: ${baseline.data[0].completed_tasks + 500}`)).toBeVisible();
    await expect(page.getByLabel(`Overdue tasks: ${baseline.data[0].overdue_tasks + 505}`)).toBeVisible();

    await page.goto("/app/projects");
    await expect(page.locator(`a[href="/app/projects/${projectId}"]`).getByText("505 open · 500 done", { exact: true })).toBeVisible();
    await page.goto(`/app/projects/${projectId}`);
    await expect(page.getByText("505 open · 500 done", { exact: true })).toBeVisible();
    await expect(page.getByText(`${name} task 1004`, { exact: true }).first()).toBeVisible();
    await page.goto("/app/board");
    await expect(page.getByRole("region", { name: "Todo" }).getByText(`${name} task 1004`, { exact: true })).toBeVisible();
  } finally {
    const cleanup = await client.from("projects").delete().eq("id", projectId);
    if (cleanup.error) throw new Error(`Could not remove test fixture: ${cleanup.error.message}`);
  }
});
