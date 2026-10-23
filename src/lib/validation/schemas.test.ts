import { describe, expect, it } from "vitest";

import {
  plannerInputSchema,
  plannerPreviewSchema,
  projectCreateSchema,
  taskCreateSchema,
} from "@/lib/validation/schemas";

describe("project validation", () => {
  it("rejects a target date before the start date", () => {
    const result = projectCreateSchema.safeParse({
      name: "Launch",
      startDate: "2026-10-20",
      targetDate: "2026-10-10",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes an empty description to null", () => {
    const result = projectCreateSchema.parse({
      name: "Launch",
      description: "   ",
      status: "active",
    });

    expect(result.description).toBeNull();
  });

  it("rejects an invalid calendar date", () => {
    const result = projectCreateSchema.safeParse({
      name: "Launch",
      startDate: "2026-02-30",
    });

    expect(result.success).toBe(false);
  });
});

describe("task validation", () => {
  it("rejects an invalid status", () => {
    const result = taskCreateSchema.safeParse({
      projectId: "11111111-1111-4111-8111-111111111111",
      title: "Write the outline",
      status: "blocked",
    });

    expect(result.success).toBe(false);
  });

  it("defaults status and priority", () => {
    const result = taskCreateSchema.parse({
      projectId: "11111111-1111-4111-8111-111111111111",
      title: "Write the outline",
    });

    expect(result.status).toBe("todo");
    expect(result.priority).toBe("medium");
  });
});

describe("planner validation", () => {
  it("requires a meaningful idea and bounded duration", () => {
    expect(plannerInputSchema.safeParse({ idea: "short", durationWeeks: 4 }).success).toBe(false);
    expect(
      plannerInputSchema.safeParse({
        idea: "A community running club site with routes and schedules.",
        durationWeeks: 20,
      }).success,
    ).toBe(false);
  });

  it("requires at least one task in a saved plan", () => {
    const result = plannerPreviewSchema.safeParse({
      project: { name: "Run club", description: null },
      milestones: [],
      tasks: [],
    });

    expect(result.success).toBe(false);
  });

  it("accepts a reviewed plan and normalizes blank descriptions", () => {
    const result = plannerPreviewSchema.parse({
      project: { name: "Run club", description: "  " },
      milestones: [
        {
          title: "Publish routes",
          description: "",
          targetDate: "2026-11-01",
        },
      ],
      tasks: [
        {
          title: "Draft the route page",
          description: "",
          priority: "high",
          dueDate: "2026-10-30",
        },
      ],
    });

    expect(result.project.description).toBeNull();
    expect(result.milestones[0]?.description).toBeNull();
    expect(result.tasks[0]?.priority).toBe("high");
  });
});
