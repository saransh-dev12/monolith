"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/client/api";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/constants";
import type { Task, TaskStatus } from "@/types/database";

type TaskDialogProps = {
  projectId: string;
  task?: Task;
  defaultStatus?: TaskStatus;
  trigger: React.ReactNode;
};

const selectClasses =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function TaskDialog({
  projectId,
  task,
  defaultStatus = "todo",
  trigger,
}: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(task);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      status: String(formData.get("status") ?? "todo"),
      priority: String(formData.get("priority") ?? "medium"),
      dueDate: String(formData.get("dueDate") ?? "") || null,
    };

    setPending(true);

    const result = isEdit
      ? await apiRequest(`/api/tasks/${task?.id}`, "PATCH", body)
      : await apiRequest("/api/tasks", "POST", { ...body, projectId });

    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Task updated." : "Task added.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{isEdit ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Change the task without losing its position in the project."
              : "Keep the title direct and add a due date when it matters."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              name="title"
              defaultValue={task?.title ?? ""}
              maxLength={200}
              placeholder="Draft the case study outline"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              name="description"
              defaultValue={task?.description ?? ""}
              maxLength={2000}
              rows={3}
              placeholder="Optional context or completion notes."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <select
                id="task-status"
                name="status"
                defaultValue={task?.status ?? defaultStatus}
                className={selectClasses}
              >
                {TASK_STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <select
                id="task-priority"
                name="priority"
                defaultValue={task?.priority ?? "medium"}
                className={selectClasses}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due date</Label>
              <Input
                id="task-due"
                name="dueDate"
                type="date"
                defaultValue={task?.due_date ?? ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isEdit ? "Save changes" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
