import { expect, test } from "@playwright/test";

test.describe("motion toolkit", () => {
  test("product tour advances and reverses with scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const waitForInteractivePage = async () => {
      await expect(async () => {
        if (await page.getByRole("button", { name: "Pause demo" }).isVisible()) {
          await page.getByRole("button", { name: "Pause demo" }).click();
        }
        await expect(page.getByRole("button", { name: "Resume demo" })).toBeVisible({ timeout: 500 });
      }).toPass();
    };
    await waitForInteractivePage();
    const scrollToTour = async (fraction: number) => {
      await page.evaluate((value) => {
        const section = document.querySelector("#product")!;
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + (section.getBoundingClientRect().height - window.innerHeight) * value);
      }, fraction);
    };
    await scrollToTour(0.05);
    await expect(page.getByRole("tab", { name: "Command" })).toHaveAttribute("data-state", "active");
    await scrollToTour(0.5);
    await expect(page.getByRole("tab", { name: "Board" })).toHaveAttribute("data-state", "active");
    await scrollToTour(0.95);
    await expect(page.getByRole("tab", { name: "Planner" })).toHaveAttribute("data-state", "active");
    await scrollToTour(0.05);
    await expect(page.getByRole("tab", { name: "Command" })).toHaveAttribute("data-state", "active");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await waitForInteractivePage();
    await scrollToTour(0.05);
    await expect(page.getByRole("tab", { name: "Command" })).toHaveAttribute("data-state", "active");
    await scrollToTour(0.5);
    await expect(page.getByRole("tab", { name: "Board" })).toHaveAttribute("data-state", "active");
    await scrollToTour(0.95);
    await expect(page.getByRole("tab", { name: "Planner" })).toHaveAttribute("data-state", "active");
  });
  test("product tour remains manually selectable with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("tab", { name: "Planner" }).click();
    await expect(page.getByRole("tab", { name: "Planner" })).toHaveAttribute("data-state", "active");
    await expect(page.getByText("Community run club").first()).toBeVisible();
  });
  test("the stream follows scrolling with reduced motion enabled", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const canvas = page.locator("#site-3d");
    const brightestRow = () => canvas.evaluate((element: HTMLCanvasElement) => {
      const context = element.getContext("2d")!;
      const { data, width, height } = context.getImageData(0, 0, element.width, element.height);
      let bestRow = 0;
      let bestLight = 0;
      for (let y = 0; y < height; y += 4) {
        let light = 0;
        for (let x = 0; x < width; x += 4) light += data[(y * width + x) * 4 + 3];
        if (light > bestLight) { bestLight = light; bestRow = y; }
      }
      return bestRow / height;
    });
    const initial = await brightestRow();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await expect.poll(brightestRow).toBeGreaterThan(initial + 0.2);
    const middle = await brightestRow();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(brightestRow).toBeGreaterThan(middle + 0.2);
  });
  test("the stream spans the viewport on laptop and monitor", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [1280, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const center = () => page.locator("#site-3d").evaluate((element: HTMLCanvasElement) => {
        const { data, width: w, height: h } = element.getContext("2d")!.getImageData(0, 0, element.width, element.height);
        let max = 0;
        let centerX = 0;
        for (let y = 0; y < h; y += 4) {
          let sum = 0;
          let weighted = 0;
          for (let x = 0; x < w; x += 4) {
            const alpha = data[(y * w + x) * 4 + 3];
            sum += alpha;
            weighted += alpha * x;
          }
          if (sum > max) { max = sum; centerX = weighted / sum / w; }
        }
        return centerX;
      });
      await expect.poll(center).toBeGreaterThan(0.7);
      await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
      await expect.poll(center).toBeLessThan(0.3);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(center).toBeGreaterThan(0.7);
    }
  });
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
    const pause = page.getByRole("button", { name: "Pause demo" });
    await pause.click();
    await expect(page.getByRole("button", { name: "Resume demo" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await expect(page.getByRole("button", { name: "Review", exact: true })).toHaveAttribute("aria-pressed", "true");

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
          "See how far you have come.",
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
