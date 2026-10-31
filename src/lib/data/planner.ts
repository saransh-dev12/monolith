import "server-only";

import { todayIsoDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { createQuotaClient } from "@/lib/supabase/quota-server";
import type { PlannerPreview } from "@/lib/validation/schemas";

export const DEFAULT_PLANNER_DAILY_LIMIT = 5;

export function getPlannerDailyLimit(): number {
  const configured = Number(process.env.PLANNER_DAILY_LIMIT);
  if (!Number.isInteger(configured) || configured < 1 || configured > 50) {
    return DEFAULT_PLANNER_DAILY_LIMIT;
  }
  return configured;
}

export type PlannerUsage = {
  used: number;
  limit: number;
  remaining: number;
};

export async function getPlannerUsage(): Promise<PlannerUsage> {
  const supabase = await createClient();
  const limit = getPlannerDailyLimit();

  const { data, error } = await supabase
    .from("planner_usage")
    .select("generations")
    .eq("period_start", todayIsoDate())
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load planner usage: ${error.message}`);
  }

  const used = data?.generations ?? 0;

  return {
    used,
    limit,
    remaining: Math.max(limit - used, 0),
  };
}

export async function reservePlannerGeneration(userId: string): Promise<
  PlannerUsage & { allowed: boolean }
> {
  const supabase = createQuotaClient();
  const limit = getPlannerDailyLimit();

  const { data, error } = await supabase.rpc("consume_planner_generation", {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) {
    throw new Error(`Could not reserve a planner generation: ${error.message}`);
  }

  const usage = data?.[0];

  if (!usage) {
    throw new Error("Planner quota did not return a result.");
  }

  return {
    allowed: usage.allowed,
    used: usage.used,
    limit: usage.quota,
    remaining: usage.remaining,
  };
}

export async function releasePlannerGeneration(userId: string): Promise<void> {
  const supabase = createQuotaClient();
  const { error } = await supabase.rpc("release_planner_generation", { p_user_id: userId });

  if (error) {
    console.error("Could not release planner quota", {
      code: error.code,
      message: error.message,
    });
  }
}

export async function saveReviewedPlan(plan: PlannerPreview) {
  const supabase = await createClient();

  return supabase.rpc("create_project_plan", {
    p_name: plan.project.name,
    p_description: plan.project.description,
    p_milestones: plan.milestones.map((milestone) => ({
      title: milestone.title,
      description: milestone.description,
      target_date: milestone.targetDate,
    })),
    p_tasks: plan.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: "todo",
      priority: task.priority,
      due_date: task.dueDate,
    })),
  });
}
