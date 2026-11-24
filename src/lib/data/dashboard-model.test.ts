import { describe, expect, it } from "vitest";
import { rankFocusTasks } from "./dashboard-model";
import type { Task } from "@/types/database";

describe("rankFocusTasks", () => {
  it("orders overdue, started, then remaining work by date and priority without mutating input", () => {
    const task = (
      id: string,
      status: Task["status"],
      due_date: string | null,
      priority: Task["priority"] = "medium",
    ) => ({ id, title: id, status, due_date, priority });
    const input = [
      task("undated", "todo", null),
      task("started", "in_progress", null),
      task("late", "todo", "2026-01-01"),
      task("done", "done", "2025-01-01"),
      task("high", "todo", "2026-01-20", "high"),
      task("low", "todo", "2026-01-20", "low"),
    ];
    expect(rankFocusTasks(input, "2026-01-10").map((item) => item.id)).toEqual([
      "late",
      "started",
      "high",
      "low",
      "undated",
    ]);
    expect(input[0].id).toBe("undated");
  });
});
