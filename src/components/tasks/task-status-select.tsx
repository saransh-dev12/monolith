"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiRequest } from "@/lib/client/api";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/constants";
import type { TaskStatus } from "@/types/database";

export function TaskStatusSelect({
  taskId,
  status,
  taskTitle,
}: {
  taskId: string;
  status: TaskStatus;
  taskTitle: string;
}) {
  const [value, setValue] = useState<TaskStatus>(status);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as TaskStatus;
    const previousStatus = value;

    if (nextStatus === previousStatus) {
      return;
    }

    setValue(nextStatus);
    setPending(true);

    const result = await apiRequest<{ task: unknown }>(
      `/api/tasks/${taskId}/status`,
      "PATCH",
      { status: nextStatus },
    );

    setPending(false);

    if (!result.ok) {
      setValue(previousStatus);
      toast.error(result.message);
      return;
    }

    toast.success(`Moved to ${TASK_STATUS_LABELS[nextStatus]}.`);
    router.refresh();
  }

  return (
    <select
      aria-label={`Status for ${taskTitle}`}
      value={value}
      onChange={handleChange}
      disabled={pending}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
    >
      {TASK_STATUS_ORDER.map((option) => (
        <option key={option} value={option}>
          {TASK_STATUS_LABELS[option]}
        </option>
      ))}
    </select>
  );
}
