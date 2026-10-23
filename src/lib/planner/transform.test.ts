import { describe, expect, it } from "vitest";

import { modelPlanJsonSchema, modelPlanSchema } from "@/lib/ai/plan-schema";
import { buildPlannerPreview } from "@/lib/planner/transform";

const modelPlan = {
  projectName: "Community run club",
  projectDescription: "Publish routes and a weekly schedule.",
  milestones: [
    {
      title: "Route section live",
      description: "Publish the first three routes.",
      targetOffsetDays: 7,
    },
    {
      title: "Weekly schedule live",
      description: "",
      targetOffsetDays: 21,
    },
  ],
  tasks: [
    {
      title: "Draft three route pages",
      description: "Include distance and meeting point.",
      priority: "high" as const,
      dueOffsetDays: 5,
    },
    {
      title: "Add the weekly schedule",
      description: "",
      priority: "medium" as const,
      dueOffsetDays: 12,
    },
  ],
};

describe("model plan schema", () => {
  it("rejects offsets outside a year", () => {
    const result = modelPlanSchema.safeParse({
      ...modelPlan,
      tasks: [
        { ...modelPlan.tasks[0], dueOffsetDays: 500 },
        modelPlan.tasks[1],
      ],
    });

    expect(result.success).toBe(false);
  });

  it("produces a strict JSON schema for structured output", () => {
    expect(modelPlanJsonSchema.type).toBe("object");
    expect(modelPlanJsonSchema.additionalProperties).toBe(false);
    expect(Array.isArray(modelPlanJsonSchema.required)).toBe(true);
  });
});

describe("planner transform", () => {
  it("turns relative offsets into calendar dates", () => {
    const preview = buildPlannerPreview(modelPlan, "2026-10-24");

    expect(preview.milestones[0]?.targetDate).toBe("2026-10-31");
    expect(preview.milestones[1]?.targetDate).toBe("2026-11-14");
    expect(preview.tasks[0]?.dueDate).toBe("2026-10-29");
    expect(preview.tasks[0]?.priority).toBe("high");
  });

  it("normalizes empty model descriptions", () => {
    const preview = buildPlannerPreview(modelPlan, "2026-10-24");

    expect(preview.milestones[1]?.description).toBeNull();
    expect(preview.tasks[1]?.description).toBeNull();
  });
});
