import { expect, test, type Page } from "@playwright/test";

const DEMO_PROJECT_ID = "33333333-3333-4333-8333-333333333331";

function unique(label: string): string {
  return `${label} ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

async function signIn(
  page: Page,
  email = "demo@monolith.local",
  password = "monolith-demo",
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
}

test.describe("public and protected routes", () => {
  test("rejects an external backslash redirect before and after sign-in", async ({ page }) => {
    const unsafeLogin = "/login?next=%2F%5Cattacker.example";
    await page.goto(unsafeLogin);
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password").fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    await page.goto(unsafeLogin);
    await expect(page).toHaveURL(/\/app$/);
  });

  test("redirects unauthenticated visitors and returns 401 from mutations", async ({
    page,
  }) => {
    await page.goto("/app");
    await expect(page).toHaveURL(/\/login\?next=/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

    const response = await page.request.post("/api/projects", {
      data: { name: "Unauthenticated" },
      headers: { Origin: "http://localhost:3000" },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("core workspace flow", () => {
  test("creates and edits a project, task, milestone, board state, and removes it", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const projectName = unique("E2E project");
    const taskName = unique("E2E task");
    const milestoneName = unique("E2E milestone");

    await signIn(page);
    await expect(page.getByText("Currently done tasks by last update; edits can change the date")).toBeVisible();
    await expect(page.getByRole("img", { name: /Currently done tasks by their last update date/ })).toBeVisible();
    await page.goto("/app/projects");

    await page.getByRole("button", { name: "New project" }).click();
    const projectDialog = page.getByRole("dialog");
    await projectDialog.getByLabel("Name").fill(projectName);
    await projectDialog.getByLabel("Description").fill("Created by Playwright.");
    await projectDialog.getByRole("button", { name: "Create project" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.getByRole("link", { name: projectName }).click();
    await page.waitForURL(/\/app\/projects\/[0-9a-f-]+$/);
    const projectUrl = page.url();
    const projectId = projectUrl.split("/").pop() ?? "";

    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.getByRole("button", { name: "Add task" }).first().click();
    const taskDialog = page.getByRole("dialog");
    await taskDialog.getByLabel("Title").fill(taskName);
    await taskDialog.getByLabel("Priority").selectOption("high");
    await taskDialog.getByRole("button", { name: "Add task" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("#main").getByText(taskName).first()).toBeVisible();

    const detailStatus = page.locator(
      `select[aria-label="Status for ${taskName}"]:visible`,
    );
    await detailStatus.selectOption("in_progress");
    await expect(page.getByText("Moved to In progress.")).toBeVisible();
    await page.reload();
    await expect(page.locator("#main").getByText(taskName).first()).toBeVisible();
    await expect(detailStatus).toHaveValue("in_progress");

    await page.getByRole("button", { name: "Add milestone" }).click();
    const milestoneDialog = page.getByRole("dialog");
    await milestoneDialog.getByLabel("Title").fill(milestoneName);
    await milestoneDialog.getByLabel("Target date").fill("2027-02-01");
    await milestoneDialog.getByRole("button", { name: "Add milestone" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("#main").getByText(milestoneName)).toBeVisible();

    await page
      .getByRole("button", { name: `Mark ${milestoneName} complete` })
      .click();
    await expect(page.getByText("Milestone completed.")).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("button", { name: `Mark ${milestoneName} incomplete` }),
    ).toBeVisible();

    await page.goto("/app/board");
    await expect(page.getByRole("heading", { name: "Board" })).toBeVisible();
    await page
      .locator(`select[aria-label="Status for ${taskName}"]:visible`)
      .selectOption("done");
    await expect(page.getByText("Moved to Done.")).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("region", { name: "Done" }).getByText(taskName),
    ).toBeVisible();

    await page.goto(projectUrl);
    await page.getByRole("button", { name: "Archive project" }).click();
    await page.waitForURL("**/app/projects");
    await expect(page.getByRole("link", { name: projectName })).toHaveCount(0);

    await page.goto("/app/projects?archived=1");
    await page.getByRole("link", { name: projectName }).click();
    await page.getByRole("button", { name: "Restore project" }).click();
    await expect(page.getByText("This project is archived.")).toBeHidden();

    await page.getByRole("button", { name: "Delete project" }).click();
    const deleteDialog = page.getByRole("alertdialog");
    await deleteDialog.getByRole("button", { name: "Delete permanently" }).click();
    await page.waitForURL("**/app/projects");
    await expect(page.getByRole("link", { name: projectName })).toHaveCount(0);

    expect(errors).toEqual([]);

    const cleanup = await page.request.delete(`/api/projects/${projectId}`, {
      headers: { Origin: "http://localhost:3000" },
    });
    expect([200, 404]).toContain(cleanup.status());
  });
});

test.describe("authorization", () => {
  test("another user cannot read or mutate demo data", async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    });
    const page = await context.newPage();
    await signIn(page, "second@monolith.local");

    await page.goto(`/app/projects/${DEMO_PROJECT_ID}`);
    await expect(page.getByText("Project not found")).toBeVisible();

    const update = await page.request.patch(`/api/projects/${DEMO_PROJECT_ID}`, {
      data: { name: "hijacked" },
      headers: { Origin: "http://localhost:3000" },
    });
    expect(update.status()).toBe(404);

    const insert = await page.request.post("/api/tasks", {
      data: { projectId: DEMO_PROJECT_ID, title: "intrusion" },
      headers: { Origin: "http://localhost:3000" },
    });
    expect([400, 404]).toContain(insert.status());

    await context.close();
  });

  test("mutations from another origin are rejected", async ({ page }) => {
    await signIn(page);

    const response = await page.request.post("/api/projects", {
      data: { name: "CSRF" },
      headers: { Origin: "https://evil.example" },
    });
    expect(response.status()).toBe(403);
  });
});

test.describe("planner", () => {
  test("renders the planner and persists only a confirmed plan", async ({
    page,
  }) => {
    const projectName = unique("Planned project");
    const milestoneName = unique("Planned milestone");
    const taskName = unique("Planned task");

    await signIn(page);
    await page.goto("/app/planner");
    await expect(page.getByRole("heading", { name: "Planner" })).toBeVisible();

    const unconfigured = await page.request.post("/api/planner/generate", {
      data: {
        idea: "A community running club site with routes and schedules.",
        durationWeeks: 4,
      },
      headers: { Origin: "http://localhost:3000" },
    });
    expect([200, 503]).toContain(unconfigured.status());

    const blocked = await page.request.post("/api/planner/confirm", {
      data: {
        project: { name: projectName, description: null },
        milestones: [],
        tasks: [],
      },
      headers: { Origin: "http://localhost:3000" },
    });
    expect(blocked.status()).toBe(422);

    const plan = {
      project: {
        name: projectName,
        description: "Saved by the Playwright planner check.",
      },
      milestones: [
        {
          title: milestoneName,
          description: "First checkpoint.",
          targetDate: "2027-03-01",
        },
      ],
      tasks: [
        {
          title: taskName,
          description: "First task.",
          priority: "high",
          dueDate: "2027-02-20",
        },
      ],
    };

    const confirm = await page.request.post("/api/planner/confirm", {
      data: plan,
      headers: { Origin: "http://localhost:3000" },
    });
    expect(confirm.status()).toBe(201);
    const body = (await confirm.json()) as { projectId: string };
    expect(body.projectId).toBeTruthy();

    await page.goto(`/app/projects/${body.projectId}`);
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
    await expect(page.locator("#main").getByText(milestoneName)).toBeVisible();
    await expect(page.locator("#main").getByText(taskName).first()).toBeVisible();

    const cleanup = await page.request.delete(
      `/api/projects/${body.projectId}`,
      { headers: { Origin: "http://localhost:3000" } },
    );
    expect(cleanup.status()).toBe(200);
  });
});

test.describe("navigation shell", () => {
  test("opens the command palette and navigates to the planner", async ({
    page,
  }) => {
    await signIn(page);
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+k" : "Control+k",
    );
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("option", { name: /Planner/ }).click();
    await expect(page).toHaveURL(/\/app\/planner$/);
    await expect(page.getByRole("heading", { name: "Planner" })).toBeVisible();
  });
});


test.describe("motion and drag", () => {
  test("moves a task by dragging and persists the status", async ({ page }) => {
    await signIn(page);
    await page.goto("/app/board");
    await expect(page.getByRole("heading", { name: "Board" })).toBeVisible();

    const todoColumn = page.getByRole("region", { name: "Todo" });
    const target = page.getByRole("region", { name: "In progress" });
    const handle = todoColumn.getByRole("button", { name: /^Drag / }).first();
    await expect(handle).toBeVisible();

    const label = await handle.getAttribute("aria-label");
    const taskName = label?.replace(/^Drag /, "") ?? "";
    expect(taskName).not.toBe("");

    await handle.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    const handleBox = await handle.boundingBox();
    const targetBox = await target.boundingBox();
    expect(handleBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    if (handleBox && targetBox) {
      await page.mouse.move(
        handleBox.x + handleBox.width / 2,
        handleBox.y + handleBox.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 - 10,
        handleBox.y + handleBox.height / 2,
        { steps: 3 },
      );
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + 80,
        { steps: 15 },
      );
      await page.mouse.up();
    }

    await expect(page.getByText("Moved to In progress.")).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("region", { name: "In progress" }).getByText(taskName),
    ).toBeVisible();

    await page
      .getByRole("region", { name: "In progress" })
      .getByLabel(`Status for ${taskName}`)
      .selectOption("todo");
    await expect(page.getByText("Moved to Todo.")).toBeVisible();
  });

  test("removes hover lift under reduced motion and survives rapid toggles", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await signIn(page);
    await page.goto("/app/projects");

    const projectLink = page.getByRole("link", { name: "Portfolio relaunch" });
    const liftWrapper = projectLink.locator("..");
    await projectLink.hover();
    await page.waitForTimeout(300);
    await expect(liftWrapper).toHaveCSS("transform", "none");

    const trigger = page
      .locator("header")
      .getByRole("button", { name: "Toggle Sidebar" });
    await trigger.click();
    await trigger.click();
    await trigger.click();
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("account and responsive layout", () => {
  test("signs up a new account, shows an empty workspace, and signs out", async ({
    page,
  }) => {
    const email = `e2e-${Date.now()}@example.com`;

    await page.goto("/signup");
    await page.getByLabel("Name").fill("E2E New User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("test-password-123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/app");
    await expect(page.getByText("No projects yet")).toBeVisible();

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.waitForURL("**/login");
  });

  test("keeps the workspace usable at a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);

    await expect(
      page.getByRole("button", { name: "Toggle Sidebar" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Command Center" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    for (const path of ["/app", "/app/projects", "/app/planner", "/app/board"]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `${path} should not overflow horizontally`).toBe(false);
    }
  });
});
