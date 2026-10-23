import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { TaskStatus } from "@/types/database";
import type {
  TaskCreateInput,
  TaskStatusUpdateInput,
  TaskUpdateInput,
} from "@/lib/validation/schemas";

async function nextPosition(projectId: string, status: TaskStatus) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("position")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { position: 0, error };
  }

  return { position: (data?.position ?? -1) + 1, error: null };
}

export async function createTask(input: TaskCreateInput) {
  const supabase = await createClient();

  let position = input.position;

  if (position === undefined) {
    const next = await nextPosition(input.projectId, input.status);
    if (next.error) {
      return { data: null, error: next.error };
    }
    position = next.position;
  }

  return supabase
    .from("tasks")
    .insert({
      project_id: input.projectId,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      due_date: input.dueDate ?? null,
      position,
    })
    .select()
    .single();
}

export async function updateTask(taskId: string, input: TaskUpdateInput) {
  const supabase = await createClient();

  return supabase
    .from("tasks")
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { due_date: input.dueDate } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
    })
    .eq("id", taskId)
    .select()
    .single();
}

export async function updateTaskStatus(
  taskId: string,
  input: TaskStatusUpdateInput,
) {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("tasks")
    .select("project_id")
    .eq("id", taskId)
    .maybeSingle();

  if (readError) {
    return { data: null, error: readError };
  }

  if (!existing) {
    return { data: null, error: null };
  }

  let position = input.position;

  if (position === undefined) {
    const next = await nextPosition(existing.project_id, input.status);
    if (next.error) {
      return { data: null, error: next.error };
    }
    position = next.position;
  }

  return supabase
    .from("tasks")
    .update({ status: input.status, position })
    .eq("id", taskId)
    .select()
    .single();
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  return supabase.from("tasks").delete().eq("id", taskId).select("id");
}
