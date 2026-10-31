import { describe, expect, it, vi } from "vitest";
import { fetchAll, fetchByProjectBatches } from "./pagination";

describe("bounded data reads", () => {
  it("retrieves all rows beyond the API's 1,000-row limit", async () => {
    const rows = Array.from({ length: 1205 }, (_, index) => index);
    const page = vi.fn((from: number, to: number) =>
      Promise.resolve({ data: rows.slice(from, to + 1), error: null, count: rows.length }),
    );
    expect(await fetchAll(page, "tasks")).toEqual(rows);
    expect(page.mock.calls).toEqual([[0, 499], [500, 999], [1000, 1499]]);
  });

  it("continues when the API caps responses below the requested page size", async () => {
    const rows = Array.from({ length: 1205 }, (_, index) => index);
    const page = vi.fn((from: number, to: number) => Promise.resolve({
      data: rows.slice(from, Math.min(to + 1, from + 200)), error: null, count: rows.length,
    }));
    expect(await fetchAll(page, "tasks")).toEqual(rows);
    expect(page.mock.calls.map(([from]) => from)).toEqual([0, 200, 400, 600, 800, 1000, 1200]);
  });

  it("fails if an incomplete response makes no progress", async () => {
    await expect(fetchAll(async () => ({ data: [], error: null, count: 1 }), "tasks"))
      .rejects.toThrow("tasks: incomplete page");
  });

  it("fails instead of returning a partial list when a later page errors", async () => {
    const page = vi.fn().mockResolvedValueOnce({ data: Array(500).fill(1), error: null, count: 1000 })
      .mockResolvedValueOnce({ data: null, error: { message: "unavailable" }, count: null });
    await expect(fetchAll(page, "tasks")).rejects.toThrow("tasks: unavailable");
  });

  it("bounds project filter size and combines every batch", async () => {
    const ids = Array.from({ length: 205 }, (_, index) => String(index));
    const batch = vi.fn(async (items: string[]) => items);
    expect(await fetchByProjectBatches(ids, batch)).toEqual(ids);
    expect(batch.mock.calls.map(([items]) => items.length)).toEqual([100, 100, 5]);
  });
});
