import { expect, test } from "@playwright/test";

test.describe("motion toolkit", () => {
  test("marketing workflow uses native scrolling and keyboard-accessible steps", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute("aria-label", "Ideas don't ship. Execution does.");
    await page.getByRole("link", { name: "Workflow" }).click();
    await expect(page).toHaveURL(/#story/);
    const stage = page.locator("[data-workflow-stage]");
    await expect(stage).toBeVisible();
    await expect(stage.locator("xpath=parent::*")).not.toHaveClass(/pin-spacer/);
    const step = stage.getByRole("button", { name: "Read the plan before it exists." });
    await step.focus();
    await page.keyboard.press("Enter");
    await expect(step).toHaveAttribute("aria-pressed", "true");
    await expect(stage.getByText("Plan · illustrative", { exact: true })).toBeVisible();
    await stage.getByRole("button", { name: "Only what the records prove." }).click();
    await expect(stage.getByText("Progress · illustrative", { exact: true })).toBeVisible();
    await page.getByRole("tab", { name: "Board" }).click();
    await expect(page.getByText("Click a card to advance", { exact: false }).first()).toBeVisible();
    await page.getByRole("tab", { name: "Planner" }).click();
    await expect(page.getByText("Community run club", { exact: false }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the demo can be paused beyond the autoplay interval", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Pause demo" }).click();
    await expect(page.getByRole("button", { name: "Resume demo" })).toBeVisible();
    const active = page.getByRole("button", { name: "Describe" });
    await active.click();
    await page.mouse.move(0, 0);
    await page.getByRole("heading", { level: 1 }).click();
    await page.waitForTimeout(5000);
    await expect(active).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Resume demo" })).toBeVisible();
  });

  test("keyboard focus keeps the demo paused after the pointer leaves", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Pause demo" })).toBeEnabled();
    const active = page.getByRole("button", { name: "Describe" });
    await active.click();
    await page.mouse.move(0, 0);
    await expect(active).toBeFocused();
    await page.waitForTimeout(5000);
    await expect(active).toHaveAttribute("aria-pressed", "true");
  });

  test("concepts demonstrate motion and stay static when reduced", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const route of ["brutalism", "atelier", "editorial"]) {
      await page.goto(`/concepts/${route}`);
      await expect(page.locator("html")).toHaveClass(/lenis/);
      const y = await page.evaluate(() => {
        const heading = [...document.querySelectorAll("h2")].find((node) =>
          /Hard cuts|sequence|Read across/i.test(node.textContent ?? ""),
        );
        return heading
          ? window.scrollY + heading.getBoundingClientRect().top - 100
          : 0;
      });
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(400);
      await page.evaluate(() => window.scrollBy(0, 900));
      await expect
        .poll(() => page.locator("body").innerText())
        .toContain("03 / 03");
    }

    await context.close();

    const reduced = await browser.newContext({ reducedMotion: "reduce" });
    const reducedPage = await reduced.newPage();
    await reducedPage.goto("/");
    await expect(reducedPage.locator("html")).not.toHaveClass(/lenis/);
    await expect(
      reducedPage
        .getByText(
          "Only what the records prove.",
        )
        .first(),
    ).toBeVisible();

    await reducedPage.goto("/concepts/brutalism");
    await expect
      .poll(() =>
        reducedPage.evaluate(() =>
          [...document.querySelectorAll("ol li p")]
            .slice(0, 3)
            .every((node) => Number(getComputedStyle(node).opacity) > 0.5),
        ),
      )
      .toBe(true);
    await reduced.close();

    expect(errors).toEqual([]);
  });
});
