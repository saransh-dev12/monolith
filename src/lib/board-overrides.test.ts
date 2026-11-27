import { describe, expect, it } from "vitest";
import { snapshotSupersedesOverride } from "./board-overrides";

describe("board status reconciliation", () => {
  const confirmed = { status: "in_progress" as const, confirmedAt: "2026-01-01T12:00:00.100Z" };
  it("accepts a matching snapshot", () => {
    expect(snapshotSupersedesOverride({ status: "in_progress", updated_at: null }, confirmed)).toBe(true);
  });
  it("retains a confirmed move against an older or indistinguishable snapshot", () => {
    for (const updated_at of ["2026-01-01T12:00:00.099Z", "2026-01-01T12:00:00.100Z", null, "invalid"]) {
      expect(snapshotSupersedesOverride({ status: "todo", updated_at }, confirmed)).toBe(false);
    }
  });
  it("accepts a clearly newer server update even if its status differs", () => {
    expect(snapshotSupersedesOverride({ status: "done", updated_at: "2026-01-01T12:00:00.101Z" }, confirmed)).toBe(true);
  });
  it("never discards a pending move for an unrelated snapshot", () => {
    expect(snapshotSupersedesOverride({ status: "done", updated_at: "2027-01-01T00:00:00Z" }, { status: "in_progress" })).toBe(false);
  });
});
