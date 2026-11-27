import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("concurrent planner confirmations are idempotent and scoped to one reviewed plan", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@monolith.local");
  await page.getByLabel("Password", { exact: true }).fill("monolith-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
  const plan = {
    confirmationId: randomUUID(),
    project: { name: `Idempotency test ${Date.now()}`, description: null },
    milestones: [{ title: "Milestone", description: null, targetDate: null }],
    tasks: [
      { title: "Task", description: null, priority: "medium", dueDate: null },
    ],
  };
  const ids = new Set<string>();
  try {
    const responses = await Promise.all(
      Array.from({ length: 4 }, () =>
        page.request.post("/api/planner/confirm", { data: plan }),
      ),
    );
    for (const response of responses) {
      expect(response.status()).toBe(201);
      const result = await response.json();
      ids.add(result.projectId);
    }
    expect(ids.size).toBe(1);
    const conflict = await page.request.post("/api/planner/confirm", {
      data: { ...plan, project: { ...plan.project, name: "Changed plan" } },
    });
    expect(conflict.status()).toBe(409);
    const id = [...ids][0];
    const project = await page.request.get(`/app/projects/${id}`);
    expect(project.status()).toBe(200);
    const deleted = await page.request.delete(`/api/projects/${id}`);
    expect(deleted.status()).toBe(200);
    const replay = await page.request.post("/api/planner/confirm", {
      data: plan,
    });
    expect(replay.status()).toBe(410);
    ids.delete(id);
  } finally {
    for (const id of ids) await page.request.delete(`/api/projects/${id}`);
  }
});
