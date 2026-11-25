import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { MilestonePath } from "@/components/dashboard/milestone-path";
import { CommandMotion } from "@/components/dashboard/command-motion";
import { ProgressValue } from "@/components/dashboard/progress-value";
import { ActionArrow } from "@/components/dashboard/action-arrow";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/projects";
import {
  formatDate,
  formatShortDate,
  isOverdue,
  relativeTime,
  todayIsoDate,
} from "@/lib/format";

export const metadata = { title: "Command Center · Monolith" };

const statusLabel = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const;

export default async function DashboardPage(props: PageProps<"/app">) {
  const searchParams = await props.searchParams;
  const user = await requireUser();
  const {
    metrics,
    projects,
    milestones,
    focusTasks,
    upcomingTasks,
    recentActivity,
    inProgressTasks,
    stageCounts,
  } = await getDashboardData();
  const today = todayIsoDate();
  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );
  const activeProjectIds = new Set(activeProjects.map((project) => project.id));
  const requestedProject =
    typeof searchParams.project === "string" ? searchParams.project : undefined;
  const featured =
    activeProjects.find((project) => project.id === requestedProject) ??
    activeProjects.find(
      (project) => project.id === focusTasks[0]?.project_id,
    ) ??
    activeProjects[0];
  const featuredMilestones = milestones
    .filter(
      (milestone) =>
        milestone.project_id === featured?.id && !milestone.completed_at,
    )
    .sort(
      (a, b) =>
        (a.target_date ?? "9999-12-31").localeCompare(
          b.target_date ?? "9999-12-31",
        ) || a.title.localeCompare(b.title),
    );
  const focus = focusTasks[0];
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date());
  const timeline = [
    ...inProgressTasks
      .slice(0, 1)
      .filter((task) => task.updated_at)
      .map((task) => ({
        id: `started-${task.id}`,
        projectId: task.project_id,
        projectName: task.projectName,
        title: task.title,
        date: task.updated_at!.slice(0, 10),
        kind: "Updated · In progress",
        overdue: false,
      })),
    ...recentActivity
      .filter((event) => event.status === "done" && event.updatedAt)
      .slice(0, 1)
      .map((event) => ({
        id: `done-${event.id}`,
        projectId: event.projectId,
        projectName: event.projectName,
        title: event.title,
        date: event.updatedAt.slice(0, 10),
        kind: "Updated · Done",
        overdue: false,
      })),
    ...upcomingTasks.slice(0, 3).map((task) => ({
      id: `task-${task.id}`,
      projectId: task.project_id,
      projectName: task.projectName,
      title: task.title,
      date: task.due_date!,
      kind: task.overdue ? "Overdue task" : "Task due",
      overdue: task.overdue,
    })),
    ...milestones
      .filter(
        (milestone) =>
          !milestone.completed_at &&
          milestone.target_date &&
          activeProjectIds.has(milestone.project_id),
      )
      .sort((a, b) => (a.target_date ?? "").localeCompare(b.target_date ?? ""))
      .slice(0, 2)
      .map((milestone) => ({
        id: `milestone-${milestone.id}`,
        projectId: milestone.project_id,
        projectName: milestone.projectName,
        title: milestone.title,
        date: milestone.target_date!,
        kind: "Milestone target",
        overdue: milestone.target_date! < today,
      })),
  ].sort(
    (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
  );

  return (
    <CommandMotion>
      <div className="space-y-7 pb-10 sm:space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-border/60 pb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {date} <span aria-hidden="true">·</span> {user.displayName}&apos;s
              workspace
            </p>
            <h1 className="mt-2 font-display text-3xl leading-[1.08] tracking-[-0.025em] sm:text-4xl">
              Command Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {metrics.overdueTasks > 0
                ? `${metrics.overdueTasks} ${metrics.overdueTasks === 1 ? "task needs" : "tasks need"} attention · `
                : ""}
              {metrics.activeProjects} active{" "}
              {metrics.activeProjects === 1 ? "project" : "projects"} ·{" "}
              {metrics.openTasks} open{" "}
              {metrics.openTasks === 1 ? "task" : "tasks"}
            </p>
          </div>
          <ProjectDialog
            trigger={
              <Button className="h-10">
                <Plus className="size-4" aria-hidden="true" />
                Create project
              </Button>
            }
          />
        </header>

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
          <>
            <section aria-labelledby="featured-heading" className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                <h2
                  id="featured-heading"
                  className="font-brand text-sm font-semibold"
                >
                  Project in focus
                </h2>
                <span className="text-xs text-muted-foreground">
                  {featured
                    ? featured.id === focus?.project_id
                      ? "Linked to your next action"
                      : requestedProject === featured.id
                        ? "Selected project"
                        : "Most recently updated active project"
                    : "No active project"}
                </span>
              </div>
              {featured ? (
                <>
                  <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.7fr)] lg:gap-12 lg:py-10">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className="size-2 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        Active project
                      </p>
                      <h3 className="mt-4 max-w-3xl font-display text-4xl leading-[1.04] tracking-[-0.035em] sm:text-5xl xl:text-6xl">
                        <Link
                          href={`/app/projects/${featured.id}`}
                          className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          {featured.name}
                        </Link>
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {featured.description ||
                          "Add an objective to give this project a clear direction."}
                      </p>
                      <Link
                        href={`/app/projects/${featured.id}`}
                        className="group mt-6 inline-flex min-h-11 items-center gap-4 rounded-lg border border-foreground/20 px-4 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        Open project <ActionArrow />
                      </Link>
                      <div className="mt-8 flex flex-wrap items-end gap-x-9 gap-y-5 border-t border-border/60 pt-5">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Execution progress
                          </p>
                          <p className="mt-1 font-brand text-2xl tabular-nums">
                            <ProgressValue value={featured.progress.percent} />
                          </p>
                          <div
                            role="progressbar"
                            aria-label={`${featured.name} execution progress`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={featured.progress.percent}
                            className="mt-2 h-1 w-28 bg-muted"
                          >
                            <div
                              data-command-progress
                              className="h-full bg-primary"
                              style={{ width: `${featured.progress.percent}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Outstanding
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {featured.progress.openTasks} open tasks
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {featured.progress.completedMilestones}/
                            {featured.progress.totalMilestones} milestones
                            complete
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Project target
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {formatDate(featured.target_date) ?? "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <section
                      aria-labelledby="focus-heading"
                      className="relative flex min-w-0 flex-col justify-between border-t border-border/70 pt-6 lg:border-t-0 lg:border-l lg:pl-7 lg:pt-0"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h2
                            id="focus-heading"
                            className="font-brand text-base font-semibold"
                          >
                            Next action
                          </h2>
                          <span
                            className="size-2 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          Overdue first, then work in progress, due date and
                          priority
                        </p>
                        {focus ? (
                          <div className="mt-7">
                            <p className="text-xs text-muted-foreground">
                              {focus.projectName}
                            </p>
                            <h3 className="mt-3 font-brand text-xl font-semibold leading-snug">
                              <Link
                                href={`/app/projects/${focus.project_id}`}
                                className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                              >
                                {focus.title}
                              </Link>
                            </h3>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">
                              {statusLabel[focus.status]} ·{" "}
                              {focus.priority.charAt(0).toUpperCase() +
                                focus.priority.slice(1)}{" "}
                              priority ·{" "}
                              <span
                                className={
                                  isOverdue(focus.due_date, focus.status, today)
                                    ? "text-primary"
                                    : ""
                                }
                              >
                                {isOverdue(focus.due_date, focus.status, today)
                                  ? "Overdue · "
                                  : ""}
                                {focus.due_date
                                  ? `Due ${formatShortDate(focus.due_date)}`
                                  : "No due date"}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="mt-7 text-sm text-muted-foreground">
                            No open tasks in active projects.
                          </p>
                        )}
                      </div>
                      <Link
                        href={
                          focus
                            ? `/app/projects/${focus.project_id}`
                            : "/app/planner"
                        }
                        className="group mt-6 inline-flex min-h-11 w-fit items-center gap-3 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {focus ? "Continue work" : "Open planner"}
                        <ActionArrow />
                      </Link>
                    </section>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-card/50 px-5 py-6 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-brand text-base font-semibold">
                        The path ahead
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Upcoming milestones
                      </p>
                    </div>
                    {featuredMilestones.length ? (
                      <MilestonePath
                        projectId={featured.id}
                        milestones={featuredMilestones
                          .slice(0, 3)
                          .map((milestone) => ({
                            id: milestone.id,
                            title: milestone.title,
                            date:
                              formatShortDate(milestone.target_date) ??
                              "No target date",
                          }))}
                      />
                    ) : (
                      <p className="mt-5 text-sm text-muted-foreground">
                        No upcoming milestone.{" "}
                        <Link
                          href={`/app/projects/${featured.id}`}
                          className="text-foreground underline underline-offset-4"
                        >
                          Add a milestone
                        </Link>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="py-8 text-sm text-muted-foreground">
                  No active projects.{" "}
                  <Link
                    href="/app/projects"
                    className="text-foreground underline underline-offset-4"
                  >
                    View your projects
                  </Link>
                </p>
              )}
            </section>

            <section
              aria-labelledby="projects-heading"
              className="border-t border-border/60 pt-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2
                    id="projects-heading"
                    className="font-brand text-lg font-semibold"
                  >
                    Project landscape
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose a project to inspect its execution.
                  </p>
                </div>
                <Link
                  href="/app/projects"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  All projects ↗
                </Link>
              </div>
              {activeProjects.length ? (
                <nav
                  aria-label="Choose an active project"
                  className="mt-4 flex gap-2 overflow-x-auto pb-2"
                >
                  {activeProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/app?project=${encodeURIComponent(project.id)}`}
                      aria-current={
                        project.id === featured?.id ? "page" : undefined
                      }
                      className={`group flex min-h-12 min-w-40 shrink-0 items-center justify-between gap-4 rounded-lg border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${project.id === featured?.id ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/70 bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                    >
                      <span>{project.name}</span>
                      <span className="font-brand tabular-nums">
                        {project.progress.percent}%
                      </span>
                    </Link>
                  ))}
                </nav>
              ) : (
                <p className="py-5 text-sm text-muted-foreground">
                  No active projects right now.
                </p>
              )}
            </section>

            <section aria-label="Execution summary" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border/60 py-4 text-sm text-muted-foreground">
              <span>Active projects: {metrics.activeProjects}</span>
              <span>Open tasks: {metrics.openTasks}</span>
              <span>Completed tasks: {metrics.completedTasks}</span>
              <span>Overdue tasks: {metrics.overdueTasks}</span>
            </section>

            <div className="grid gap-9 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] xl:gap-10">
              <section aria-labelledby="timeline-heading" className="min-w-0">
                <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3">
                  <div>
                    <h2
                      id="timeline-heading"
                      className="font-brand text-lg font-semibold"
                    >
                      Execution timeline
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Task updates, deadlines and milestone targets
                    </p>
                  </div>
                  <Link
                    href="/app/board"
                    className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Open board <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                {timeline.length ? (
                  <ol className="relative ml-1 border-l border-border/70">
                    {timeline.map((event) => (
                      <li key={event.id} className="relative pl-5">
                        <span
                          className={`absolute -left-[4.5px] top-6 size-2 rounded-full ${event.overdue ? "bg-primary" : "bg-muted-foreground"}`}
                          aria-hidden="true"
                        />
                        <Link
                          href={`/app/projects/${event.projectId}`}
                          className="grid gap-1 border-b border-border/40 py-4 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                        >
                          <span
                            className={`text-xs tabular-nums ${event.overdue ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {formatShortDate(event.date)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {event.title}
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                              {event.projectName}
                            </span>
                          </span>
                          <span
                            className={`text-xs ${event.overdue ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {event.overdue && event.kind === "Milestone target"
                              ? "Past target · milestone"
                              : event.kind}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="py-6 text-sm text-muted-foreground">
                    No upcoming task deadlines or milestone targets.
                  </p>
                )}
                <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 text-xs text-muted-foreground">
                  <span>{stageCounts.inProgress} in progress</span>
                  <span>{stageCounts.done} tasks done</span>
                  <span>{stageCounts.todo} to do</span>
                </div>
              </section>

              <section aria-labelledby="activity-heading" className="min-w-0">
                <div className="border-b border-border/60 pb-3">
                  <h2
                    id="activity-heading"
                    className="font-brand text-lg font-semibold"
                  >
                    Recent updates
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Latest task changes, not a complete history
                  </p>
                </div>
                {recentActivity.length ? (
                  <ol className="divide-y divide-border/40">
                    {recentActivity.slice(0, 4).map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/app/projects/${event.projectId}`}
                          className="flex items-start gap-3 py-4 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm">
                              {event.title}
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                              {event.projectName} · {statusLabel[event.status]}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {relativeTime(event.updatedAt)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="py-6 text-sm text-muted-foreground">
                    Task updates will appear here as work progresses.
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </CommandMotion>
  );
}
