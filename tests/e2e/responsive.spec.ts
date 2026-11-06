import { expect, test, type Page } from "@playwright/test";

// Responsive sweep per the v1.0 directive: no horizontal overflow, no
// clipped content traps, on every core route at the required viewports.
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const ROUTES = ["/", "/login", "/signup", "/privacy", "/terms"] as const;

async function measureOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const pageOverflow = doc.scrollWidth - doc.clientWidth;
    const offenders: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const rect = el.getBoundingClientRect();
      if (rect.right > doc.clientWidth + 1 && rect.width > 40) {
        const style = getComputedStyle(el);
        if (style.position === "fixed" || style.position === "absolute") continue;
        if (el.closest("[data-overflow-clip]")) continue;
        offenders.push(el.tagName + "." + String(el.getAttribute("class") || "").slice(0, 40));
      }
    }
    return { pageOverflow, offenders: offenders.slice(0, 5) };
  });
}

test.describe("responsive layout sweep", () => {
  for (const route of ROUTES) {
    test(`public route ${route} has no horizontal overflow`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await page.waitForTimeout(700);
        const overflow = await measureOverflow(page);
        expect(
          overflow.pageOverflow,
          `${route} @ ${viewport.width}px: page scrollWidth exceeds clientWidth by ${overflow.pageOverflow}px`,
        ).toBeLessThanOrEqual(0);
        expect(
          overflow.offenders,
          `${route} @ ${viewport.width}px: overflowing elements`,
        ).toEqual([]);
      }
    });
  }

  test("workspace routes have no horizontal overflow", async ({ page }) => {
    test.setTimeout(240_000);
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Local seed account (available in dev and CI via supabase db reset).
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password").fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");
    const detailLink = page
      .getByRole("link", { name: /Portfolio relaunch|Local market/ })
      .first();
    const detailHref = (await detailLink.getAttribute("href")) ?? "/app/projects";
    await page.getByTestId("account-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.waitForURL("**/login");

    const workspaceRoutes = ["/app", "/app/projects", detailHref, "/app/board", "/app/planner"];

    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@monolith.local");
    await page.getByLabel("Password").fill("monolith-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/app");

    for (const route of workspaceRoutes) {
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await page.waitForTimeout(700);
        const overflow = await measureOverflow(page);
        expect(
          overflow.pageOverflow,
          `${route} @ ${viewport.width}px: page scrollWidth exceeds clientWidth by ${overflow.pageOverflow}px`,
        ).toBeLessThanOrEqual(0);
        expect(
          overflow.offenders,
          `${route} @ ${viewport.width}px: overflowing elements`,
        ).toEqual([]);
      }
    }
  });
});
