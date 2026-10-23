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
import type { Milestone } from "@/types/database";

export function MilestoneDialog({
  projectId,
  milestone,
  trigger,
}: {
  projectId: string;
  milestone?: Milestone;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(milestone);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      targetDate: String(formData.get("targetDate") ?? "") || null,
      ...(isEdit
        ? { completed: formData.get("completed") === "on" }
        : { projectId }),
    };

    setPending(true);

    const result = isEdit
      ? await apiRequest(`/api/milestones/${milestone?.id}`, "PATCH", body)
      : await apiRequest("/api/milestones", "POST", body);

    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Milestone updated." : "Milestone added.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit milestone" : "New milestone"}
          </DialogTitle>
          <DialogDescription>
            Milestones are checkpoints that contribute to the project&apos;s
            progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone-title">Title</Label>
            <Input
              id="milestone-title"
              name="title"
              defaultValue={milestone?.title ?? ""}
              maxLength={160}
              placeholder="Content complete"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-description">Description</Label>
            <Textarea
              id="milestone-description"
              name="description"
              defaultValue={milestone?.description ?? ""}
              maxLength={2000}
              rows={2}
              placeholder="What must be true at this checkpoint?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="milestone-target">Target date</Label>
              <Input
                id="milestone-target"
                name="targetDate"
                type="date"
                defaultValue={milestone?.target_date ?? ""}
              />
            </div>
            {isEdit ? (
              <label className="flex items-end gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  name="completed"
                  defaultChecked={Boolean(milestone?.completed_at)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                Completed
              </label>
            ) : null}
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
              {isEdit ? "Save changes" : "Add milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
