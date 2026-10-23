import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
} from "lucide-react";

import { ProjectDangerActions } from "@/components/projects/project-danger-actions";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { PageHeader } from "@/components/shell/page-header";
import {
  ProjectStatusBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-badges";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskItem } from "@/components/tasks/task-item";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProjectDetail } from "@/lib/data/projects";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Project · Monolith",
};

export default async function ProjectDetailPage(
  props: PageProps<"/app/projects/[projectId]">,
) {
  const { projectId } = await props.params;
  const detail = await getProjectDetail(projectId);

  if (!detail) {
    notFound();
  }

  const { project, tasks, milestones } = detail;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const openTasks = tasks.length - doneTasks;
  const completedMilestones = milestones.filter(
    (milestone) => milestone.completed_at,
  ).length;
  const totalItems = tasks.length + milestones.length;
  const completedItems = doneTasks + completedMilestones;
  const percent =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/app/projects">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Projects
          </Link>
        </Button>
      </div>

      <PageHeader
        title={project.name}
        description={project.description ?? "No description yet."}
        actions={
          <>
            <ProjectDialog
              project={project}
              trigger={
                <Button variant="outline">
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit
                </Button>
              }
            />
            {!project.archived_at ? (
              <TaskDialog
                projectId={project.id}
                trigger={
                  <Button>
                    <Plus className="size-4" aria-hidden="true" />
                    Add task
                  </Button>
                }
              />
            ) : null}
          </>
        }
      />

      {project.archived_at ? (
        <p className="mb-6 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          This project is archived. Restore it to add or move work.
        </p>
      ) : null}

      <div className="mb-8 grid gap-4 rounded-lg border border-border/60 bg-card/30 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Start date
          </p>
          <p className="text-sm">{formatDate(project.start_date) ?? "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Target date
          </p>
          <p className="text-sm">{formatDate(project.target_date) ?? "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tasks
          </p>
          <p className="text-sm">
            {openTasks} open · {doneTasks} done
          </p>
        </div>
      </div>

      <section className="mb-8 space-y-2" aria-label="Project progress">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedItems} of {totalItems} items complete
          </span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} />
      </section>

      <div className="space-y-6">
        {TASK_STATUS_ORDER.map((status) => {
          const columnTasks = tasks.filter((task) => task.status === status);

          return (
            <section key={status} aria-labelledby={`task-group-${status}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 id={`task-group-${status}`} className="text-sm font-medium">
                    {TASK_STATUS_LABELS[status]}
                  </h2>
                  <TaskStatusBadge status={status} />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>
                {!project.archived_at ? (
                  <TaskDialog
                    projectId={project.id}
                    defaultStatus={status}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Plus className="size-4" aria-hidden="true" />
                        Add
                      </Button>
                    }
                  />
                ) : null}
              </div>

              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  No tasks in this column.
                </p>
              ) : (
                <ul className="space-y-2">
                  {columnTasks.map((task) => (
                    <TaskItem key={task.id} task={task} projectId={project.id} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <section className="mt-10" aria-labelledby="milestones-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="milestones-heading" className="text-sm font-medium">
            Milestones
          </h2>
          <span className="text-xs text-muted-foreground">
            {milestones.length === 0
              ? "None yet"
              : `${completedMilestones} of ${milestones.length} complete`}
          </span>
        </div>

        {milestones.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            No milestones on this project.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 rounded-lg border border-border/60 bg-card/20">
            {milestones.map((milestone) => {
              const completed = Boolean(milestone.completed_at);
              const targetDate = formatDate(milestone.target_date);

              return (
                <li
                  key={milestone.id}
                  className="flex items-start gap-3 px-4 py-3"
                >
                  {completed ? (
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={completed ? "text-sm text-muted-foreground" : "text-sm"}>
                      {milestone.title}
                    </p>
                    {milestone.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {milestone.description}
                      </p>
                    ) : null}
                  </div>
                  {targetDate ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {targetDate}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <ProjectDangerActions
          projectId={project.id}
          projectName={project.name}
          archived={Boolean(project.archived_at)}
        />
      </div>
    </>
  );
}
