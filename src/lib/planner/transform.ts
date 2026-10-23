import { addDaysIso } from "@/lib/format";
import type { ModelPlan } from "@/lib/ai/plan-schema";
import type { PlannerPreview } from "@/lib/validation/schemas";

export function buildPlannerPreview(
  plan: ModelPlan,
  todayIso: string,
): PlannerPreview {
  return {
    project: {
      name: plan.projectName,
      description: plan.projectDescription.trim() ? plan.projectDescription : null,
    },
    milestones: plan.milestones.map((milestone) => ({
      title: milestone.title,
      description: milestone.description.trim()
        ? milestone.description
        : null,
      targetDate: addDaysIso(todayIso, milestone.targetOffsetDays),
    })),
    tasks: plan.tasks.map((task) => ({
      title: task.title,
      description: task.description.trim() ? task.description : null,
      priority: task.priority,
      dueDate: addDaysIso(todayIso, task.dueOffsetDays),
    })),
  };
}
