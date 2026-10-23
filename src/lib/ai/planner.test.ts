import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    responses = { create: createMock };
  },
}));

import {
  generateModelPlan,
  isPlannerConfigured,
  PlannerConfigError,
  PlannerOutputError,
  PlannerProviderError,
} from "@/lib/ai/planner";

const validPlan = {
  projectName: "Community run club",
  projectDescription: "A site for weekly routes.",
  milestones: [
    { title: "Publish routes", description: "", targetOffsetDays: 7 },
    { title: "Launch", description: "", targetOffsetDays: 21 },
  ],
  tasks: [
    {
      title: "Draft route pages",
      description: "",
      priority: "high",
      dueOffsetDays: 5,
    },
    {
      title: "Add schedule",
      description: "",
      priority: "medium",
      dueOffsetDays: 12,
    },
    {
      title: "Write launch note",
      description: "",
      priority: "low",
      dueOffsetDays: 20,
    },
  ],
};

const input = {
  idea: "A community running club site with routes and schedules.",
  durationWeeks: 4,
  audience: null,
  constraints: null,
};

beforeEach(() => {
  vi.stubEnv("OPENAI_API_KEY", "test-key");
  vi.stubEnv("OPENAI_MODEL", "test-model");
  createMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("generateModelPlan", () => {
  it("reports a configuration error without credentials", async () => {
    vi.stubEnv("OPENAI_API_KEY", "placeholder");

    await expect(generateModelPlan(input)).rejects.toBeInstanceOf(
      PlannerConfigError,
    );
    expect(isPlannerConfigured()).toBe(false);
  });

  it("parses a valid structured response", async () => {
    createMock.mockResolvedValue({ output_text: JSON.stringify(validPlan) });

    const plan = await generateModelPlan(input);

    expect(plan.projectName).toBe("Community run club");
    expect(plan.tasks).toHaveLength(3);
    expect(createMock).toHaveBeenCalledOnce();
  });

  it("rejects malformed JSON output", async () => {
    createMock.mockResolvedValue({ output_text: "{not json" });

    await expect(generateModelPlan(input)).rejects.toBeInstanceOf(
      PlannerOutputError,
    );
  });

  it("rejects output that misses the schema", async () => {
    createMock.mockResolvedValue({
      output_text: JSON.stringify({ ...validPlan, tasks: [] }),
    });

    await expect(generateModelPlan(input)).rejects.toBeInstanceOf(
      PlannerOutputError,
    );
  });

  it("maps provider failures to a safe error", async () => {
    createMock.mockRejectedValue(new Error("provider stack detail"));

    await expect(generateModelPlan(input)).rejects.toBeInstanceOf(
      PlannerProviderError,
    );
  });
});
