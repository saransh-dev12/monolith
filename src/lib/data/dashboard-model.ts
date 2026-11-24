import type { Task } from "@/types/database";

type FocusCandidate = Pick<
  Task,
  "id" | "status" | "priority" | "due_date" | "title"
>;

/** Overdue work first, then work already started, then dated work by urgency. */
export function rankFocusTasks<T extends FocusCandidate>(
  tasks: T[],
  today: string,
): T[] {
  const priority = { high: 0, medium: 1, low: 2 } as const;
  const group = (task: T) =>
    task.due_date && task.due_date < today
      ? 0
      : task.status === "in_progress"
        ? 1
        : 2;
  return tasks
    .filter((task) => task.status !== "done")
    .slice()
    .sort(
      (a, b) =>
        group(a) - group(b) ||
        (a.due_date ?? "9999-12-31").localeCompare(
          b.due_date ?? "9999-12-31",
        ) ||
        priority[a.priority] - priority[b.priority] ||
        a.title.localeCompare(b.title) ||
        a.id.localeCompare(b.id),
    );
}
