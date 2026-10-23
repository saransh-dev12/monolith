import { z } from "zod";

import { taskPrioritySchema } from "@/lib/validation/schemas";

export const modelPlanSchema = z.object({
  projectName: z.string().trim().min(1).max(120),
  projectDescription: z.string().trim().max(1200),
  milestones: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(160),
        description: z.string().trim().max(400),
        targetOffsetDays: z.number().int().min(0).max(365),
      }),
    )
    .min(2)
    .max(6),
  tasks: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(400),
        priority: taskPrioritySchema,
        dueOffsetDays: z.number().int().min(0).max(365),
      }),
    )
    .min(3)
    .max(20),
});

export type ModelPlan = z.infer<typeof modelPlanSchema>;

export const modelPlanJsonSchema = (() => {
  const schema = z.toJSONSchema(modelPlanSchema, {
    target: "draft-7",
  }) as Record<string, unknown>;
  delete schema.$schema;
  return schema;
})();
