"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  LoaderCircle,
  Plus,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/client/api";
import { addDaysIso, todayIsoDate } from "@/lib/format";
import type {
  PlannerMilestone,
  PlannerPreview,
  PlannerTask,
} from "@/lib/validation/schemas";

type Quota = {
  used: number;
  limit: number;
  remaining: number;
};

type GenerateResponse = {
  plan: PlannerPreview;
  quota: Quota;
};

const selectClasses =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function newMilestone(): PlannerMilestone {
  return {
    title: "New milestone",
    description: null,
    targetDate: addDaysIso(todayIsoDate(), 14),
  };
}

function newTask(): PlannerTask {
  return {
    title: "New task",
    description: null,
    priority: "medium",
    dueDate: addDaysIso(todayIsoDate(), 7),
  };
}

export function PlannerWorkspace({
  configured,
  initialQuota,
}: {
  configured: boolean;
  initialQuota: Quota;
}) {
  const [plan, setPlan] = useState<PlannerPreview | null>(null);
  const [quota, setQuota] = useState<Quota>(initialQuota);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generationDisabled =
    !configured || quota.remaining < 1 || generating;

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = {
      idea: String(formData.get("idea") ?? ""),
      audience: String(formData.get("audience") ?? "") || null,
      durationWeeks: Number(formData.get("durationWeeks") ?? 4),
      constraints: String(formData.get("constraints") ?? "") || null,
    };

    setError(null);
    setGenerating(true);

    const result = await apiRequest<GenerateResponse>(
      "/api/planner/generate",
      "POST",
      body,
    );

    setGenerating(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setPlan(result.data.plan);
    setQuota(result.data.quota);
    toast.success("Draft plan ready for review.");
  }

  async function handleSave() {
    if (!plan) {
      return;
    }

    setError(null);
    setSaving(true);

    const result = await apiRequest<{ projectId: string }>(
      "/api/planner/confirm",
      "POST",
      plan,
    );

    setSaving(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    toast.success("Plan saved as a project.");
    router.push(`/app/projects/${result.data.projectId}`);
  }

  function updatePlan(updater: (current: PlannerPreview) => PlannerPreview) {
    setPlan((current) => (current ? updater(current) : current));
  }

  function updateMilestone(index: number, patch: Partial<PlannerMilestone>) {
    updatePlan((current) => ({
      ...current,
      milestones: current.milestones.map((milestone, position) =>
        position === index ? { ...milestone, ...patch } : milestone,
      ),
    }));
  }

  function updateTask(index: number, patch: Partial<PlannerTask>) {
    updatePlan((current) => ({
      ...current,
      tasks: current.tasks.map((task, position) =>
        position === index ? { ...task, ...patch } : task,
      ),
    }));
  }

  return (
    <div className="space-y-8">
      {!configured ? (
        <div
          role="status"
          className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/8 p-4 text-sm"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-medium">AI planning is not configured</p>
            <p className="text-primary/80">
              Add <code className="font-mono text-xs">OPENAI_API_KEY</code> and{" "}
              <code className="font-mono text-xs">OPENAI_MODEL</code> on the
              server to enable generation. The rest of Monolith works without
              it.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-sm">
        <p className="text-muted-foreground">
          {quota.remaining > 0 ? (
            <>
              <span className="font-medium text-foreground">
                {quota.remaining}
              </span>{" "}
              of {quota.limit} plan generations left today
            </>
          ) : (
            "Today's generation limit is used up."
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Generation never saves anything on its own.
        </p>
      </div>

      {!plan ? (
        <form
          onSubmit={handleGenerate}
          className="space-y-6 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-chart-1/25 to-chart-2/25 text-primary">
              <WandSparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-2xl leading-none">Describe the idea</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A little context produces a more useful draft. You will review
                every item before it can become a project.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planner-idea">Idea</Label>
            <Textarea
              id="planner-idea"
              name="idea"
              rows={5}
              minLength={20}
              maxLength={1200}
              required
              placeholder="A small site that helps local running clubs publish routes, meeting points, and weekly schedules."
            />
            <p className="text-xs text-muted-foreground">
              At least 20 characters. Avoid pasting private credentials or
              personal data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="planner-audience">Audience (optional)</Label>
              <Input
                id="planner-audience"
                name="audience"
                maxLength={200}
                placeholder="Solo runners and club organizers"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planner-duration">Planning horizon</Label>
              <select
                id="planner-duration"
                name="durationWeeks"
                defaultValue="4"
                className={selectClasses}
              >
                {[1, 2, 3, 4, 6, 8, 12].map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} {weeks === 1 ? "week" : "weeks"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planner-constraints">Constraints (optional)</Label>
            <Textarea
              id="planner-constraints"
              name="constraints"
              rows={2}
              maxLength={500}
              placeholder="Evenings only, no budget for paid services, must work on mobile."
            />
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={generationDisabled}
              title={
                !configured
                  ? "Configure the OpenAI environment variables first."
                  : quota.remaining < 1
                    ? "Daily limit reached."
                    : undefined
              }
            >
              {generating ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {generating ? "Building a draft" : "Generate draft"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Draft only. Nothing is written to your workspace yet.
            </p>
          </div>
        </form>
      ) : (
        <motion.div
          data-motion-reveal
          className="space-y-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3">
            <div>
              <p className="font-display text-2xl leading-none">Draft plan · not saved</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Edit anything below. Only the final confirmation writes to the
                database.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPlan(null);
                setError(null);
              }}
            >
              Start over
            </Button>
          </div>

          <section aria-labelledby="draft-project-heading" className="space-y-4">
            <h2 id="draft-project-heading" className="font-display text-2xl leading-none">
              Project
            </h2>
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/30 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="draft-name">Name</Label>
                <Input
                  id="draft-name"
                  value={plan.project.name}
                  maxLength={120}
                  onChange={(event) =>
                    updatePlan((current) => ({
                      ...current,
                      project: { ...current.project, name: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="draft-description">Description</Label>
                <Textarea
                  id="draft-description"
                  value={plan.project.description ?? ""}
                  rows={2}
                  maxLength={2000}
                  onChange={(event) =>
                    updatePlan((current) => ({
                      ...current,
                      project: {
                        ...current.project,
                        description: event.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="draft-milestones-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="draft-milestones-heading" className="font-display text-2xl leading-none">
                  Milestones
                </h2>
                <p className="text-xs text-muted-foreground">
                  {plan.milestones.length} proposed · optional
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePlan((current) => ({
                    ...current,
                    milestones: [...current.milestones, newMilestone()],
                  }))
                }
              >
                <Plus className="size-4" aria-hidden="true" />
                Add milestone
              </Button>
            </div>

            {plan.milestones.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No milestones. Add one if the plan needs checkpoints.
              </p>
            ) : (
              <ol className="space-y-3">
                {plan.milestones.map((milestone, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-border/60 bg-card/30 p-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                      <div className="space-y-2">
                        <Label htmlFor={`milestone-title-${index}`}>
                          Milestone {index + 1}
                        </Label>
                        <Input
                          id={`milestone-title-${index}`}
                          value={milestone.title}
                          maxLength={160}
                          onChange={(event) =>
                            updateMilestone(index, { title: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`milestone-date-${index}`}>Target</Label>
                        <Input
                          id={`milestone-date-${index}`}
                          type="date"
                          value={milestone.targetDate ?? ""}
                          onChange={(event) =>
                            updateMilestone(index, {
                              targetDate: event.target.value || null,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`milestone-description-${index}`}>
                          Description
                        </Label>
                        <Input
                          id={`milestone-description-${index}`}
                          value={milestone.description ?? ""}
                          maxLength={400}
                          onChange={(event) =>
                            updateMilestone(index, {
                              description: event.target.value || null,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updatePlan((current) => ({
                            ...current,
                            milestones: current.milestones.filter(
                              (_, position) => position !== index,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-labelledby="draft-tasks-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="draft-tasks-heading" className="font-display text-2xl leading-none">
                  Tasks
                </h2>
                <p className="text-xs text-muted-foreground">
                  {plan.tasks.length} proposed · at least one required
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePlan((current) => ({
                    ...current,
                    tasks: [...current.tasks, newTask()],
                  }))
                }
              >
                <Plus className="size-4" aria-hidden="true" />
                Add task
              </Button>
            </div>

            <ol className="space-y-2">
              {plan.tasks.map((task, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-border/60 bg-card/30 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem_10rem]">
                    <div className="space-y-2">
                      <Label htmlFor={`task-title-${index}`}>
                        Task {index + 1}
                      </Label>
                      <Input
                        id={`task-title-${index}`}
                        value={task.title}
                        maxLength={200}
                        onChange={(event) =>
                          updateTask(index, { title: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`task-priority-${index}`}>Priority</Label>
                      <select
                        id={`task-priority-${index}`}
                        value={task.priority}
                        onChange={(event) =>
                          updateTask(index, {
                            priority: event.target.value as PlannerTask["priority"],
                          })
                        }
                        className={selectClasses}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`task-date-${index}`}>Due</Label>
                      <Input
                        id={`task-date-${index}`}
                        type="date"
                        value={task.dueDate ?? ""}
                        onChange={(event) =>
                          updateTask(index, {
                            dueDate: event.target.value || null,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-3">
                      <Label htmlFor={`task-description-${index}`}>
                        Description
                      </Label>
                      <Input
                        id={`task-description-${index}`}
                        value={task.description ?? ""}
                        maxLength={400}
                        onChange={(event) =>
                          updateTask(index, {
                            description: event.target.value || null,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={plan.tasks.length <= 1}
                      title={
                        plan.tasks.length <= 1
                          ? "A saved plan needs at least one task."
                          : undefined
                      }
                      onClick={() =>
                        updatePlan((current) => ({
                          ...current,
                          tasks: current.tasks.filter(
                            (_, position) => position !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 rounded-2xl border border-chart-3/25 bg-gradient-to-r from-card to-chart-3/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl leading-none">Ready to save?</p>
              <p className="text-xs text-muted-foreground">
                {plan.milestones.length} milestones · {plan.tasks.length} tasks
                · saved in one transaction
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" disabled={saving} className="rounded-full">
                  {saving ? (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Check className="size-4" aria-hidden="true" />
                  )}
                  Confirm and save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-3xl">Create this project now?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This writes the project, {plan.milestones.length} milestones,
                    and {plan.tasks.length} tasks to your workspace. If any
                    insert fails, nothing is saved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={saving}>Keep editing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault();
                      void handleSave();
                    }}
                    disabled={saving}
                  >
                    {saving ? (
                      <LoaderCircle
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    Save plan
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      )}
    </div>
  );
}
