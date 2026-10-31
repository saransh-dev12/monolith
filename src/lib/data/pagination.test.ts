import { describe, expect, it, vi } from "vitest";
import { fetchAll, fetchByProjectBatches } from "./pagination";

describe("bounded data reads", () => {
  it("retrieves all rows beyond the API's 1,000-row limit", async () => {
    const rows = Array.from({ length: 1205 }, (_, index) => index);
    const page = vi.fn((from: number, to: number) =>
      Promise.resolve({ data: rows.slice(from, to + 1), error: null }),
    );
    expect(await fetchAll(page, "tasks")).toEqual(rows);
    expect(page.mock.calls).toEqual([[0, 499], [500, 999], [1000, 1499]]);
  });

  it("fails instead of returning a partial list when a later page errors", async () => {
    const page = vi.fn().mockResolvedValueOnce({ data: Array(500).fill(1), error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "unavailable" } });
    await expect(fetchAll(page, "tasks")).rejects.toThrow("tasks: unavailable");
  });

  it("bounds project filter size and combines every batch", async () => {
    const ids = Array.from({ length: 205 }, (_, index) => String(index));
    const batch = vi.fn(async (items: string[]) => items);
    expect(await fetchByProjectBatches(ids, batch)).toEqual(ids);
    expect(batch.mock.calls.map(([items]) => items.length)).toEqual([100, 100, 5]);
  });
});
