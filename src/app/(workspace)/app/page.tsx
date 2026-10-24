import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Clock,
  FolderKanban,
  ListChecks,
  Plus,
  Sparkles,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectStatusBadge } from "@/components/tasks/task-badges";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/projects";
import { formatDate, isOverdue } from "@/lib/format";

export const metadata = {
  title: "Command Center · Monolith",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const { metrics, projects, nextTasks } = await getDashboardData();

  return (
    <>
      <PageHeader
        title="Command Center"
        description={`${user.displayName}, here is the current state of your work. Every number comes from your own rows.`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 xl:grid-cols-4">
        <MetricCard
          label="Active projects"
          value={metrics.activeProjects}
          hint="Not archived, still active"
          icon={FolderKanban}
        />
        <MetricCard
          label="Open tasks"
          value={metrics.openTasks}
          hint="Todo and in progress"
          icon={ListChecks}
        />
        <MetricCard
          label="Completed tasks"
          value={metrics.completedTasks}
          hint="Across visible projects"
          icon={CircleCheck}
        />
        <MetricCard
          label="Overdue tasks"
          value={metrics.overdueTasks}
          hint="Past due and still open"
          icon={Clock}
          tone={metrics.overdueTasks > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-medium">Projects</h2>
              <p className="text-sm text-muted-foreground">
                Progress combines completed tasks and milestones.
              </p>
            </div>
            {projects.length > 0 ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/projects">
                  View all
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>

          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start tracking tasks, milestones, and progress."
              onAction={
                <ProjectDialog
                  trigger={
                    <Button>
                      <Plus className="size-4" aria-hidden="true" />
                      Create a project
                    </Button>
                  }
                />
              }
            />
          ) : (
            <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-card/20">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>
                      <ProjectStatusBadge status={project.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {project.progress.openTasks} open ·{" "}
                      {project.progress.doneTasks} done
                      {project.target_date
                        ? ` · target ${formatDate(project.target_date)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex w-full items-center gap-3 sm:w-48">
                    <Progress
                      value={project.progress.percent}
                      aria-label={`${project.name} progress`}
                    />
                    <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {project.progress.percent}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section
            aria-labelledby="next-up-heading"
            className="rounded-lg border border-border/60 bg-card/20"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div>
                <h2 id="next-up-heading" className="text-sm font-medium">
                  Next up
                </h2>
                <p className="text-xs text-muted-foreground">
                  Open work ordered by due date
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/board">
                  Board
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {nextTasks.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nothing open right now. Add a task from any project.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {nextTasks.map((task) => {
                  const overdue = isOverdue(task.due_date, task.status);
                  const due = formatDate(task.due_date);

                  return (
                    <li key={task.id}>
                      <Link
                        href={`/app/projects/${task.project_id}`}
                        className="block px-4 py-3 transition-colors hover:bg-muted/20"
                      >
                        <p className="truncate text-sm">{task.title}</p>
                        <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                          <span className="truncate">{task.projectName}</span>
                          <span
                            className={
                              overdue
                                ? "inline-flex shrink-0 items-center gap-1 text-rose-300"
                                : "inline-flex shrink-0 items-center gap-1"
                            }
                          >
                            <CalendarDays
                              className="size-3"
                              aria-hidden="true"
                            />
                            {due ?? "No date"}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-border/60 bg-card/20 p-5">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-medium">Start from an idea</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Generate a draft project with milestones and tasks, then review it
              before anything is saved.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/app/planner">
                Open planner
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
