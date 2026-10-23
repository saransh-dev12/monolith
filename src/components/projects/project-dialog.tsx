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
import type { Project } from "@/types/database";

type ProjectDialogProps = {
  project?: Project;
  trigger: React.ReactNode;
};

const selectClasses =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectDialog({ project, trigger }: ProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(project);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      status: String(formData.get("status") ?? "active"),
      startDate: String(formData.get("startDate") ?? "") || null,
      targetDate: String(formData.get("targetDate") ?? "") || null,
    };

    setPending(true);

    const result = isEdit
      ? await apiRequest(`/api/projects/${project?.id}`, "PATCH", body)
      : await apiRequest("/api/projects", "POST", body);

    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Project updated." : "Project created.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the project details. Dates and status stay scoped to your account."
              : "Give the work a name, a finish line, and enough context to start."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              name="name"
              defaultValue={project?.name ?? ""}
              maxLength={120}
              placeholder="Portfolio relaunch"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              name="description"
              defaultValue={project?.description ?? ""}
              maxLength={2000}
              rows={3}
              placeholder="What does done look like?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-status">Status</Label>
              <select
                id="project-status"
                name="status"
                defaultValue={project?.status ?? "active"}
                className={selectClasses}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-target">Target date</Label>
              <Input
                id="project-target"
                name="targetDate"
                type="date"
                defaultValue={project?.target_date ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-start">Start date</Label>
            <Input
              id="project-start"
              name="startDate"
              type="date"
              defaultValue={project?.start_date ?? ""}
            />
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
              {isEdit ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
