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
import {
  ExecutionChart,
  WeekStrip,
} from "@/components/dashboard/execution-chart";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectStatusBadge } from "@/components/tasks/task-badges";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData, getExecutionSeries } from "@/lib/data/projects";
import { formatDate, isOverdue } from "@/lib/format";

export const metadata = {
  title: "Command Center · Monolith",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [{ metrics, projects, nextTasks }, series] = await Promise.all([
    getDashboardData(),
    getExecutionSeries(30),
  ]);

  return (
    <>
      <PageHeader
        title="Command Center"
        eyebrow="Workspace overview"
        description={`${user.displayName}, here is the current state of your work. Every number comes from your own rows.`}
      />

      <RevealGroup className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <RevealItem>
          <MetricCard
            label="Active projects"
            value={metrics.activeProjects}
            hint="Not archived, still active"
            icon={FolderKanban}
          />
        </RevealItem>
        <RevealItem>
          <MetricCard
            label="Open tasks"
            value={metrics.openTasks}
            hint="Todo and in progress"
            icon={ListChecks}
          />
        </RevealItem>
        <RevealItem>
          <MetricCard
            label="Completed tasks"
            value={metrics.completedTasks}
            hint="Across visible projects"
            icon={CircleCheck}
          />
        </RevealItem>
        <RevealItem>
          <MetricCard
            label="Overdue tasks"
            value={metrics.overdueTasks}
            hint={
              metrics.overdueTasks > 0
                ? "Needs attention today"
                : "Nothing past due"
            }
            icon={Clock}
            tone={metrics.overdueTasks > 0 ? "warning" : "default"}
          />
        </RevealItem>
      </RevealGroup>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
        <ExecutionChart series={series} />
        <WeekStrip series={series} />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Active work
              </p>
              <h2 className="mt-1 font-display text-3xl leading-none">Projects</h2>
              <p className="mt-1 text-xs text-muted-foreground">
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
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="hidden grid-cols-[1fr_10rem_4rem] gap-3 border-b border-border/50 px-5 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground sm:grid">
                <span>Project</span>
                <span>Progress</span>
                <span className="text-right">State</span>
              </div>
              <div className="divide-y divide-border/50">
                {projects.slice(0, 5).map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/app/projects/${project.id}`}
                    className="group grid gap-2 px-5 py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[1fr_10rem_4rem] sm:items-center sm:gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="font-mono text-[9px] tabular-nums text-muted-foreground/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                          {project.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {project.progress.openTasks} open ·{" "}
                          {project.progress.doneTasks} done
                          {project.target_date
                            ? ` · target ${formatDate(project.target_date)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={project.progress.percent}
                        aria-label={`${project.name} progress`}
                      />
                      <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                        {project.progress.percent}%
                      </span>
                    </div>
                    <div className="hidden justify-end sm:flex">
                      <ProjectStatusBadge status={project.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section
            aria-labelledby="next-up-heading"
            className="glass-card rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                  Attention
                </p>
                <h2 id="next-up-heading" className="mt-0.5 font-display text-2xl leading-none">
                  Next up
                </h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
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
                                ? "inline-flex shrink-0 items-center gap-1 text-primary"
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

          <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-chart-2/15 p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-chart-1/20 blur-2xl"
            />
            <Sparkles className="relative size-4 text-chart-2" aria-hidden="true" />
            <h2 className="relative mt-3 font-display text-2xl leading-none">
              Start from an idea
            </h2>
            <p className="relative mt-1.5 text-xs leading-5 text-muted-foreground">
              Generate a draft project with milestones and tasks, then review it
              before anything is saved.
            </p>
            <Button asChild size="sm" className="relative mt-4 rounded-full">
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
