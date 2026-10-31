import { expect, test, type Locator } from "@playwright/test";

async function contrast(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    const ancestors: Element[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) ancestors.push(node);
    // Composite translucent badge surfaces over their actual ancestor backgrounds.
    context.fillStyle = "white";
    context.fillRect(0, 0, 1, 1);
    for (const node of ancestors.reverse()) {
      context.fillStyle = getComputedStyle(node).backgroundColor;
      context.fillRect(0, 0, 1, 1);
    }
    const background = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    context.fillStyle = getComputedStyle(element).color;
    context.fillRect(0, 0, 1, 1);
    const foreground = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    const luminance = (rgb: number[]) => {
      const linear = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
    return (values[1] + 0.05) / (values[0] + 0.05);
  });
}

test("primary action maintains normal text contrast in both themes and on hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const action = page.getByRole("link", { name: "Start a project", exact: true }).first();
  for (const theme of ["Light", "Dark"]) {
    await page.getByRole("button", { name: theme, exact: true }).first().click();
    await expect.poll(() => contrast(action)).toBeGreaterThanOrEqual(4.5);
    await action.hover();
    await expect.poll(() => contrast(action)).toBeGreaterThanOrEqual(4.5);
  }
});


test("workspace semantic badges remain readable in both themes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@monolith.local");
  await page.getByLabel("Password").fill("monolith-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/app");
  for (const theme of ["Light", "Dark"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await page.goto("/app/board");
    const medium = page.getByText("Medium", { exact: true }).first();
    await expect(medium).toBeVisible();
    await expect.poll(() => contrast(medium)).toBeGreaterThanOrEqual(4.5);
    await page.goto("/app/projects");
    const completed = page.getByText("Completed", { exact: true }).first();
    await expect(completed).toBeVisible();
    await expect.poll(() => contrast(completed)).toBeGreaterThanOrEqual(4.5);
  }
});
