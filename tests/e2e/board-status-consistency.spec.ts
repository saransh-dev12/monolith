import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

async function withTask(
  page: Page,
  run: (id: string, title: string, fixture: { setStatus: (id: string, status: "todo" | "in_progress" | "done") => Promise<void>; addTask: (title: string) => Promise<void> }) => Promise<void>,
) {
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
  const project = await client
    .from("projects")
    .insert({
      owner_id: data.user.id,
      name: `Board consistency ${Date.now()}`,
      status: "active",
    })
    .select("id")
    .single();
  if (project.error || !project.data)
    throw new Error("Could not create fixture project");
  const title = `Board state ${project.data.id}`;
  try {
    const task = await client
      .from("tasks")
      .insert({ project_id: project.data.id, title, status: "todo" })
      .select("id")
      .single();
    if (task.error || !task.data)
      throw new Error("Could not create fixture task");
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    await page.goto("/app/board");
    await expect(
      page.getByRole("region", { name: "Todo" }).getByText(title),
    ).toBeVisible();
    await run(task.data.id, title, {
      setStatus: async (id, status) => {
        const result = await client.from("tasks").update({ status }).eq("id", id);
        if (result.error) throw new Error("Could not update fixture task");
      },
      addTask: async (title) => {
        const result = await client.from("tasks").insert({ project_id: project.data!.id, title, status: "todo" });
        if (result.error) throw new Error("Could not create second fixture task");
      },
    });
  } finally {
    const cleanup = await client
      .from("projects")
      .delete()
      .eq("id", project.data.id);
    if (cleanup.error) throw new Error("Could not clean up fixture project");
  }
}

async function dragToInProgress(page: Page, title: string) {
  const handle = page.getByRole("button", { name: `Drag ${title}` });
  const target = page.getByRole("region", { name: "In progress" });
  await handle.scrollIntoViewIfNeeded();
  const from = await handle.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error("Board controls have no bounding box");
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    from.x + from.width / 2 - 10,
    from.y + from.height / 2,
    { steps: 3 },
  );
  await page.mouse.move(to.x + to.width / 2, to.y + 80, { steps: 15 });
  await page.mouse.up();
}

test("status selection after dragging updates the visible column and survives reload", async ({
  page,
}) => {
  await withTask(page, async (_id, title) => {
    await dragToInProgress(page, title);
    await expect(page.getByText("Moved to In progress.")).toBeVisible();
    const inProgress = page.getByRole("region", { name: "In progress" });
    await expect(inProgress.getByText(title)).toBeVisible();
    await inProgress.getByLabel(`Status for ${title}`).selectOption("done");
    await expect(
      page.getByRole("region", { name: "Done" }).getByText(title),
    ).toBeVisible();
    await expect(page.getByText("Moved to Done.")).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("region", { name: "Done" }).getByText(title),
    ).toBeVisible();
  });
});

test("both status controls are disabled while a drag update is pending", async ({
  page,
}) => {
  await withTask(page, async (id, title) => {
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(`**/api/tasks/${id}/status`, async (route) => {
      await blocked;
      await route.continue();
    });
    try {
      await dragToInProgress(page, title);
      const inProgress = page.getByRole("region", { name: "In progress" });
      await expect(inProgress.getByLabel(`Status for ${title}`)).toBeDisabled();
      await expect(
        inProgress.getByRole("button", { name: `Drag ${title}` }),
      ).toBeDisabled();
    } finally {
      release();
    }
    await expect(page.getByText("Moved to In progress.")).toBeVisible();
  });
});

test("a failed status change restores the last successful position", async ({
  page,
}) => {
  await withTask(page, async (id, title) => {
    await dragToInProgress(page, title);
    await expect(page.getByText("Moved to In progress.")).toBeVisible();
    await page.route(`**/api/tasks/${id}/status`, (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Update failed" }),
      }),
    );
    await page
      .getByRole("region", { name: "In progress" })
      .getByLabel(`Status for ${title}`)
      .selectOption("done");
    const original = page.getByRole("region", { name: "In progress" });
    await expect(original.getByText(title)).toBeVisible();
    await expect(original.getByLabel(`Status for ${title}`)).toHaveValue(
      "in_progress",
    );
    await expect(original.getByLabel(`Status for ${title}`)).toBeEnabled();
  });
});


test("failed move does not mask a later server update", async ({ page }) => {
  await withTask(page, async (id, title, fixture) => {
    const otherTitle = `Refresh trigger ${id}`;
    await fixture.addTask(otherTitle);
    await page.reload();
    await expect(page.getByLabel(`Status for ${otherTitle}`)).toBeVisible();
    await page.route(`**/api/tasks/${id}/status`, (route) => route.fulfill({
      status: 500, contentType: "application/json", body: JSON.stringify({ error: "Update failed" }),
    }));
    await page.getByLabel(`Status for ${title}`).selectOption("in_progress");
    await expect(page.getByText("Update failed")).toBeVisible();
    await page.unroute(`**/api/tasks/${id}/status`);
    await fixture.setStatus(id, "done");
    await page.getByLabel(`Status for ${otherTitle}`).selectOption("in_progress");
    await expect(page.getByText("Moved to In progress.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Done" }).getByText(title)).toBeVisible();
  });
});
