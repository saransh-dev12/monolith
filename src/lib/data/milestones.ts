import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  MilestoneCreateInput,
  MilestoneUpdateInput,
} from "@/lib/validation/schemas";

export async function createMilestone(input: MilestoneCreateInput) {
  const supabase = await createClient();

  return supabase
    .from("milestones")
    .insert({
      project_id: input.projectId,
      title: input.title,
      description: input.description ?? null,
      target_date: input.targetDate ?? null,
    })
    .select()
    .single();
}

export async function updateMilestone(
  milestoneId: string,
  input: MilestoneUpdateInput,
) {
  const supabase = await createClient();

  return supabase
    .from("milestones")
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.targetDate !== undefined
        ? { target_date: input.targetDate }
        : {}),
      ...(input.completed !== undefined
        ? { completed_at: input.completed ? new Date().toISOString() : null }
        : {}),
    })
    .eq("id", milestoneId)
    .select()
    .single();
}

export async function deleteMilestone(milestoneId: string) {
  const supabase = await createClient();
  return supabase.from("milestones").delete().eq("id", milestoneId).select("id");
}
