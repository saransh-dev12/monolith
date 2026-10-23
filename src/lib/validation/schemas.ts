import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a YYYY-MM-DD date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "Enter a valid calendar date.");

const nullableDate = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  isoDate.nullable(),
);

const nullableText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().max(max).nullable(),
  );

export const projectStatusSchema = z.enum(["active", "completed"]);
export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const projectCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a project name.").max(120),
    description: nullableText(2000).optional(),
    status: projectStatusSchema.default("active"),
    startDate: nullableDate.optional(),
    targetDate: nullableDate.optional(),
  })
  .refine(
    (value) =>
      !value.startDate || !value.targetDate || value.targetDate >= value.startDate,
    {
      message: "Target date must be on or after the start date.",
      path: ["targetDate"],
    },
  );

export const projectUpdateSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a project name.").max(120).optional(),
    description: nullableText(2000).optional(),
    status: projectStatusSchema.optional(),
    startDate: nullableDate.optional(),
    targetDate: nullableDate.optional(),
  })
  .refine(
    (value) =>
      !value.startDate || !value.targetDate || value.targetDate >= value.startDate,
    {
      message: "Target date must be on or after the start date.",
      path: ["targetDate"],
    },
  );

export const projectArchiveSchema = z.object({
  archived: z.boolean(),
});

export const taskCreateSchema = z.object({
  projectId: z.uuid("Choose a valid project."),
  title: z.string().trim().min(1, "Enter a task title.").max(200),
  description: nullableText(2000).optional(),
  status: taskStatusSchema.default("todo"),
  priority: taskPrioritySchema.default("medium"),
  dueDate: nullableDate.optional(),
  position: z.number().int().min(0).optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1, "Enter a task title.").max(200).optional(),
  description: nullableText(2000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: nullableDate.optional(),
  position: z.number().int().min(0).optional(),
});

export const taskStatusUpdateSchema = z.object({
  status: taskStatusSchema,
  position: z.number().int().min(0).optional(),
});

export const milestoneCreateSchema = z.object({
  projectId: z.uuid("Choose a valid project."),
  title: z.string().trim().min(1, "Enter a milestone title.").max(160),
  description: nullableText(2000).optional(),
  targetDate: nullableDate.optional(),
});

export const milestoneUpdateSchema = z.object({
  title: z.string().trim().min(1, "Enter a milestone title.").max(160).optional(),
  description: nullableText(2000).optional(),
  targetDate: nullableDate.optional(),
  completed: z.boolean().optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type TaskStatusUpdateInput = z.infer<typeof taskStatusUpdateSchema>;
export type MilestoneCreateInput = z.infer<typeof milestoneCreateSchema>;
export type MilestoneUpdateInput = z.infer<typeof milestoneUpdateSchema>;

export const plannerInputSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(20, "Describe the idea in at least 20 characters.")
    .max(1200, "Keep the idea under 1,200 characters."),
  audience: nullableText(200).optional(),
  durationWeeks: z.number().int().min(1).max(12).default(4),
  constraints: nullableText(500).optional(),
});

export const plannerMilestoneSchema = z.object({
  title: z.string().trim().min(1, "Enter a milestone title.").max(160),
  description: nullableText(400),
  targetDate: nullableDate,
});

export const plannerTaskSchema = z.object({
  title: z.string().trim().min(1, "Enter a task title.").max(200),
  description: nullableText(400),
  priority: taskPrioritySchema,
  dueDate: nullableDate,
});

export const plannerPreviewSchema = z.object({
  project: z.object({
    name: z.string().trim().min(1, "Enter a project name.").max(120),
    description: nullableText(2000),
  }),
  milestones: z.array(plannerMilestoneSchema).max(12),
  tasks: z
    .array(plannerTaskSchema)
    .min(1, "Add at least one task before saving.")
    .max(40),
});

export type PlannerInput = z.infer<typeof plannerInputSchema>;
export type PlannerPreview = z.infer<typeof plannerPreviewSchema>;
export type PlannerMilestone = z.infer<typeof plannerMilestoneSchema>;
export type PlannerTask = z.infer<typeof plannerTaskSchema>;
