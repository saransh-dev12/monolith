import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// WCAG 2.2 AA automated audit. Critical and serious violations fail the
// build; moderate/minor ones are surfaced for review and documented in
// docs/v1-qa-report.md.
async function audit(page: import("@playwright/test").Page, route: string) {
  await page.goto(route);
  await page.waitForTimeout(900);
  const builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
  ]);
  return builder.analyze();
}

type AxeViolation = Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"][number];

function summarize(violations: AxeViolation[]) {
  return violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    sample: v.nodes[0]?.target.join(" > "),
  }));
}

test.describe("accessibility (WCAG 2.2 AA)", () => {
  test("landing page", async ({ page }) => {
    const results = await audit(page, "/");
    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (blocking.length > 0) console.log(summarize(blocking));
    expect(blocking).toEqual([]);
  });

  test("auth pages", async ({ page }) => {
    for (const route of ["/login", "/signup"]) {
      const results = await audit(page, route);
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      if (blocking.length > 0) console.log(route, summarize(blocking));
      expect(blocking).toEqual([]);
    }
  });

  test("legal pages", async ({ page }) => {
    for (const route of ["/privacy", "/terms"]) {
      const results = await audit(page, route);
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      if (blocking.length > 0) console.log(route, summarize(blocking));
      expect(blocking).toEqual([]);
    }
  });

  test("workspace pages", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password").fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");

    const detailLink = page
      .getByRole("link", { name: /Portfolio relaunch|Local market/ })
      .first();
    const detailHref = (await detailLink.getAttribute("href")) ?? "/app/projects";

    const routes = ["/app", "/app/projects", detailHref, "/app/board", "/app/planner"];
    const allBlocking: Array<{ route: string; summary: ReturnType<typeof summarize> }> = [];
    for (const route of routes) {
      const results = await audit(page, route);
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      if (blocking.length > 0) allBlocking.push({ route, summary: summarize(blocking) });
    }
    if (allBlocking.length > 0) console.log(allBlocking);
    expect(allBlocking).toEqual([]);
  });
});
