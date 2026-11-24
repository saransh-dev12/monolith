import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

test("workspace navigation remains usable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@monolith.local");
  await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
  for (const [name, heading] of [
    ["Projects", "Projects"],
    ["Board", "Board"],
    ["Command Center", "Command Center"],
  ]) {
    await page
      .getByRole("navigation", { name: "Workspace" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(page.locator("[data-motion-route]")).toHaveCSS(
      "transform",
      "none",
    );
  }
});

test("a new active project without milestones remains useful", async ({
  page,
}) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url !== "http://127.0.0.1:54321" || !key)
    throw new Error("Local Supabase test configuration required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({
    email: "demo@monolith.local",
    password: "monolith-demo",
  });
  if (error || !data.user) throw new Error("Could not sign in local test user");
  const name = `Dashboard fixture ${Date.now()}`;
  const project = await client
    .from("projects")
    .insert({ owner_id: data.user.id, name, status: "active" })
    .select("id")
    .single();
  if (project.error || !project.data)
    throw new Error("Could not create dashboard fixture");
  try {
    const task = await client.from("tasks").insert({ project_id: project.data.id, title: "Dashboard fixture overdue task", status: "todo", due_date: "1900-01-01" });
    if (task.error) throw new Error("Could not create dashboard task fixture");
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    const section = page.getByRole("region", { name: "Project in focus" });
    await expect(section.getByRole("link", { name })).toBeVisible();
    await expect(section.getByText("No upcoming milestone")).toBeVisible();
    await expect(section.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  } finally {
    const cleanup = await client
      .from("projects")
      .delete()
      .eq("id", project.data.id);
    if (cleanup.error) throw new Error("Could not remove dashboard fixture");
  }
});
