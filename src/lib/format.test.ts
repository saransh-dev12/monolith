import { describe, expect, it } from "vitest";

import { addDaysIso, formatDate, isOverdue, todayIsoDate } from "@/lib/format";

describe("date helpers", () => {
  it("adds days across month boundaries in UTC", () => {
    expect(addDaysIso("2026-10-30", 3)).toBe("2026-11-02");
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("formats date-only values without timezone drift", () => {
    expect(formatDate("2026-10-24")).toBe("Oct 24, 2026");
    expect(formatDate(null)).toBeNull();
  });

  it("treats only open past-due tasks as overdue", () => {
    const today = todayIsoDate(new Date("2026-10-24T12:00:00Z"));
    expect(today).toBe("2026-10-24");
    expect(isOverdue("2026-10-23", "todo", today)).toBe(true);
    expect(isOverdue("2026-10-23", "done", today)).toBe(false);
    expect(isOverdue("2026-10-25", "todo", today)).toBe(false);
    expect(isOverdue(null, "todo", today)).toBe(false);
  });
});
