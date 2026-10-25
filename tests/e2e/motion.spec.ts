import { expect, test } from "@playwright/test";

test.describe("motion toolkit", () => {
  test("marketing uses one smooth-scroll loop and a pinned workflow", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute(
      "aria-label",
      "Ideas don't ship. Execution does.",
    );

    await page.getByRole("link", { name: "Workflow" }).click();
    await expect(page).toHaveURL(/#story/);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            Math.round(
              document.querySelector("#story")?.getBoundingClientRect().top ?? 999,
            ),
        ),
      )
      .toBeLessThan(120);

    const storyY = await page.evaluate(
      () =>
        window.scrollY +
        (document.querySelector("#story")?.getBoundingClientRect().top ?? 0),
    );

    const labels: string[] = [];
    for (const delta of [0, 300, 520, 740, 960, 1180, 1400]) {
      await page.evaluate(
        ({ y, offset }) => window.scrollTo(0, y + offset),
        { y: storyY, offset: delta },
      );
      await page.waitForTimeout(350);
      labels.push(
        (await page.locator("[data-step-label]").textContent())?.trim() ?? "",
      );
    }

    expect(labels).toContain("Plan");
    expect(labels).toContain("Tasks");
    expect(labels).toContain("Execution");
    expect(labels).toContain("Progress");

    await page.getByRole("tab", { name: "Board" }).click();
    await expect(
      page.getByText("Click a card to advance", { exact: false }).first(),
    ).toBeVisible();
    await page.getByRole("tab", { name: "Planner" }).click();
    await expect(
      page.getByText("Community run club", { exact: false }).first(),
    ).toBeVisible();
    await page.getByRole("tab", { name: "Command" }).click();
    await expect(
      page.getByText("Completion pulse", { exact: false }).first(),
    ).toBeVisible();
    expect(errors).toEqual([]);
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
