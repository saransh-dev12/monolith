import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

test("a lost confirmation response can be retried after reloading without creating another project", async ({ page }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url !== "http://127.0.0.1:54321" || !key) throw new Error("Local Supabase required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const auth = await client.auth.signInWithPassword({ email: "demo@monolith.local", password: "monolith-demo" });
  if (auth.error || !auth.data.user) throw new Error("Could not sign in local fixture user");
  const storageKey = `monolith:planner-confirmation:${auth.data.user.id}`;
  const plan = {
    confirmationId: randomUUID(),
    project: { name: `Recovery ${randomUUID()}`, description: null },
    milestones: [],
    tasks: [{ title: "Recovery task", description: null, priority: "medium", dueDate: null }],
  };
  let projectId: string | undefined;
  try {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    await page.evaluate(({ storageKey, plan }) => sessionStorage.setItem(storageKey, JSON.stringify(plan)), { storageKey, plan });
    await page.goto("/app/planner");
    await expect(page.getByText("Submitted draft · save status unknown")).toBeVisible();
    await page.route("**/api/planner/confirm", async (route) => {
      const response = await route.fetch();
      expect(response.status()).toBe(201);
      projectId = (await response.json()).projectId;
      await route.abort("failed");
    });
    await page.getByRole("button", { name: "Confirm and save" }).click();
    await page.getByRole("button", { name: "Save plan" }).click();
    await expect(page.getByRole("alertdialog").getByText("The network request failed. Try again.")).toBeVisible();
    expect(projectId).toBeTruthy();
    await page.unroute("**/api/planner/confirm");
    await page.reload();
    await expect(page.getByText("Submitted draft · save status unknown")).toBeVisible();
    await page.getByRole("button", { name: "Confirm and save" }).click();
    await page.getByRole("button", { name: "Save plan" }).click();
    await page.waitForURL(`**/app/projects/${projectId}`);
    await expect(page.getByRole("heading", { name: plan.project.name })).toBeVisible();
    expect(await page.evaluate((key) => sessionStorage.getItem(key), storageKey)).toBeNull();
    const duplicates = await client.from("projects").select("id").eq("name", plan.project.name);
    expect(duplicates.error).toBeNull();
    expect(duplicates.data).toHaveLength(1);
  } finally {
    if (projectId) await client.from("projects").delete().eq("id", projectId);
  }
});

test("a definite validation rejection allows the draft to be edited and resubmitted", async ({ page }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url !== "http://127.0.0.1:54321" || !key) throw new Error("Local Supabase required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const auth = await client.auth.signInWithPassword({ email: "demo@monolith.local", password: "monolith-demo" });
  if (auth.error || !auth.data.user) throw new Error("Could not sign in local fixture user");
  const storageKey = `monolith:planner-confirmation:${auth.data.user.id}`;
  const plan = { confirmationId: randomUUID(), project: { name: "Validation draft", description: null }, milestones: [], tasks: [{ title: "Task", description: null, priority: "medium", dueDate: null }] };
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@monolith.local");
  await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
  await page.evaluate(({ storageKey, plan }) => sessionStorage.setItem(storageKey, JSON.stringify(plan)), { storageKey, plan });
  await page.goto("/app/planner");
  await expect(page.getByText("Submitted draft · save status unknown")).toBeVisible();
  const submittedIds: string[] = [];
  await page.route("**/api/planner/confirm", async (route) => {
    submittedIds.push(route.request().postDataJSON().confirmationId);
    await route.fulfill({ status: 422, contentType: "application/json", body: JSON.stringify({ error: "Invalid draft" }) });
  });
  await page.getByRole("button", { name: "Confirm and save" }).click();
  await page.getByRole("button", { name: "Save plan" }).click();
  await expect(page.getByRole("alertdialog").getByText("Invalid draft")).toBeVisible();
  expect(await page.evaluate((key) => sessionStorage.getItem(key), storageKey)).toBeNull();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Corrected draft");
  await page.getByRole("button", { name: "Confirm and save" }).click();
  await page.getByRole("button", { name: "Save plan" }).click();
  await expect(page.getByRole("alertdialog").getByText("Invalid draft")).toBeVisible();
  expect(submittedIds).toHaveLength(2);
  expect(submittedIds[0]).toBe(plan.confirmationId);
  expect(submittedIds[1]).not.toBe(submittedIds[0]);
});
