import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Clock,
  CornerDownRight,
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
import { ProjectStatusBadge, TaskPriorityBadge } from "@/components/tasks/task-badges";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData, getExecutionSeries } from "@/lib/data/projects";
import { formatDate, isOverdue, relativeTime } from "@/lib/format";

export const metadata = {
  title: "Command Center · Monolith",
};

const STATUS_DOT: Record<string, string> = {
  todo: "bg-foreground/60",
  in_progress: "bg-primary",
  done: "bg-chart-3",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [
    { metrics, projects, nextTasks, inProgressTasks, upcomingTasks, recentActivity },
    series,
  ] = await Promise.all([getDashboardData(), getExecutionSeries(30)]);

  const overdue = upcomingTasks.filter((task) => task.overdue);
  const deadlines = upcomingTasks.filter((task) => !task.overdue);
  const isEmpty = projects.length === 0;

  return (
    <>
      <PageHeader
        title="Command Center"
        eyebrow="Workspace overview"
        description={`${user.displayName}, here is the current state of your work. Every number comes from your own rows.`}
      />

      {isEmpty ? (
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
        <div className="space-y-10">
          {/* What am I working on right now? */}
          <RevealGroup>
            <RevealItem className="flex items-baseline justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">Working on now</p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  In progress
                </h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/board">
                  Board
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </RevealItem>
            {inProgressTasks.length > 0 ? (
              <RevealItem>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {inProgressTasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/app/projects/${task.project_id}`}
                        className="group block h-full"
                      >
                        <Panel className="h-full p-4 transition-colors duration-150 hover:border-primary/40">
                          <p className="eyebrow text-muted-foreground">
                            {task.projectName}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm font-medium leading-5 transition-colors group-hover:text-primary">
                            {task.title}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <TaskPriorityBadge priority={task.priority} />
                            <span className="num text-[10px] text-muted-foreground">
                              {relativeTime(task.updated_at)}
                            </span>
                          </div>
                        </Panel>
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ) : (
              <RevealItem>
                <Link
                  href="/app/planner"
                  className="group flex items-center gap-3 rounded-xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Sparkles className="size-4 text-primary" aria-hidden="true" />
                  Nothing in progress — start something on the board or draft a plan.
                  <CornerDownRight className="size-3.5" aria-hidden="true" />
                </Link>
              </RevealItem>
            )}
          </RevealGroup>

          {/* Attention summary */}
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

          {/* Execution + attention */}
          <div className="grid min-w-0 gap-4 xl:grid-cols-[1.65fr_0.85fr]">
            <div className="min-w-0 space-y-4">
              <ExecutionChart series={series} />
              <WeekStrip series={series} />
            </div>

            <Panel className="h-fit min-w-0">
              <div className="border-b border-border/50 px-4 py-3">
                <p className="eyebrow text-muted-foreground">Needs attention</p>
                <h2 className="mt-0.5 font-display text-xl leading-none">
                  Overdue &amp; deadlines
                </h2>
              </div>
              {overdue.length === 0 && deadlines.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nothing overdue and nothing due this week. Good position.
                </p>
              ) : (
                <ul className="divide-y divide-border/50">
                  {[...overdue, ...deadlines].map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/app/projects/${task.project_id}`}
                        className="block px-4 py-3 transition-colors hover:bg-muted/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm">{task.title}</p>
                          {task.overdue ? (
                            <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 eyebrow text-primary">
                              Overdue
                            </span>
                          ) : (
                            <TaskPriorityBadge priority={task.priority} />
                          )}
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="size-3" aria-hidden="true" />
                          {formatDate(task.due_date) ?? "No date"}
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{task.projectName}</span>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          {/* What changed */}
          {recentActivity.length > 0 ? (
            <RevealGroup>
              <RevealItem>
                <p className="eyebrow text-muted-foreground">Recent activity</p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  Latest touches
                </h2>
              </RevealItem>
              <RevealItem>
                <ol className="divide-y divide-border/50 rounded-2xl border border-border/70 bg-card shadow-[inset_0_1px_0_0_rgb(255_255_255/4%)]">
                  {recentActivity.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/app/projects/${event.projectId}`}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/20"
                      >
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[event.status] ?? "bg-muted-foreground"}`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm transition-colors group-hover:text-primary">
                          {event.title}
                        </span>
                        <span className="hidden eyebrow text-muted-foreground sm:inline">
                          {event.projectName}
                        </span>
                        <span className="shrink-0 num text-[10px] text-muted-foreground">
                          {relativeTime(event.updatedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </RevealItem>
            </RevealGroup>
          ) : null}

          {/* Projects overview */}
          <RevealGroup>
            <RevealItem className="flex items-baseline justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">Active work</p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  Projects
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Progress combines completed tasks and milestones.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/projects">
                  View all
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </RevealItem>
            <RevealItem>
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[inset_0_1px_0_0_rgb(255_255_255/4%)]">
                <div className="hidden grid-cols-[1fr_10rem_4rem] gap-3 border-b border-border/50 px-5 py-2 eyebrow text-muted-foreground sm:grid">
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
                        <span className="num text-[10px] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                            {project.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {project.progress.openTasks} open ·{" "}
                            {project.progress.doneTasks} done
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={project.progress.percent}
                          aria-label={`${project.name} progress`}
                        />
                        <span className="w-9 shrink-0 text-right num text-[10px] text-muted-foreground">
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
            </RevealItem>
          </RevealGroup>

          {/* Next up */}
          <RevealGroup>
            <RevealItem>
              <Panel>
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                  <div>
                    <p className="eyebrow text-muted-foreground">Queue</p>
                    <h2 className="mt-0.5 font-display text-xl leading-none">
                      Next up
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Open work ordered by due date
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/app/planner">
                      Planner
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                {nextTasks.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Nothing open right now. Add a task from any project.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/50">
                    {nextTasks.map((task) => {
                      const taskOverdue = isOverdue(task.due_date, task.status);
                      const due = formatDate(task.due_date);
                      return (
                        <li key={task.id}>
                          <Link
                            href={`/app/projects/${task.project_id}`}
                            className="block px-4 py-3 transition-colors hover:bg-muted/20"
                          >
                            <p className="truncate text-sm">{task.title}</p>
                            <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                              <span className="truncate">{task.projectName}</span>
                              <span
                                className={
                                  taskOverdue
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
              </Panel>
            </RevealItem>
          </RevealGroup>
        </div>
      )}
    </>
  );
}
