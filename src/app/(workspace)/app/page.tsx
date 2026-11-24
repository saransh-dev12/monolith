import Link from "next/link";
import { ArrowDownRight, ArrowRight, Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
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

export default async function DashboardPage() {
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
  const featured = activeProjects.find((project) => project.id === focusTasks[0]?.project_id) ?? activeProjects[0];
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
  const nextMilestone = featuredMilestones[0];
  const followingMilestone = featuredMilestones[1];
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
    <div className="space-y-8 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-7">
        <div>
          <p className="text-sm text-muted-foreground">
            {date} <span aria-hidden="true">·</span> {user.displayName}&apos;s
            workspace
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-[-0.025em] sm:text-5xl lg:text-6xl">
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
        <ProjectDialog trigger={<Button className="h-10"><Plus className="size-4" aria-hidden="true" />Create project</Button>} />
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
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.7fr)]">
            <section
              aria-labelledby="focus-heading"
              className="order-1 min-w-0 border-l-2 border-primary pl-5 py-1 sm:pl-6 xl:order-2"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 id="focus-heading" className="text-sm font-medium">
                  Next action
                </h2>
                <ArrowDownRight
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
              </div>
              {focus ? (
                <>
                  <p className="mt-7 text-xs text-muted-foreground">
                    {focus.projectName}
                  </p>
                  <h3 className="mt-2 font-brand text-xl font-semibold leading-snug">
                    <Link
                      href={`/app/projects/${focus.project_id}`}
                      className="transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {focus.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {statusLabel[focus.status]}{" "}
                    <span aria-hidden="true">·</span>{" "}
                    {focus.priority.charAt(0).toUpperCase() +
                      focus.priority.slice(1)}{" "}
                    priority
                  </p>
                  <p
                    className={`mt-1 text-sm ${isOverdue(focus.due_date, focus.status, today) ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {isOverdue(focus.due_date, focus.status, today)
                      ? "Overdue · "
                      : ""}
                    {focus.due_date
                      ? `Due ${formatShortDate(focus.due_date)}`
                      : "No due date"}
                  </p>
                  <Link
                    href={`/app/projects/${focus.project_id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    Continue work{" "}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <p className="mt-6 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">
                    Ordered by overdue work, then work in progress, then due
                    date and priority.
                  </p>
                </>
              ) : (
                <div className="py-8">
                  <p className="text-sm leading-6 text-muted-foreground">
                    No open tasks in active projects.
                  </p>
                  <Link
                    href="/app/projects"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
                  >
                    Open projects{" "}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>

            <section
              aria-labelledby="featured-heading"
              className="order-2 min-w-0 overflow-hidden xl:order-1"
            >
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
                <h2 id="featured-heading" className="text-sm font-medium">
                  Project in focus
                </h2>
                <span className="text-xs text-muted-foreground">
                  {featured
                    ? (featured.id === focus?.project_id ? "Project linked to next action" : "Most recently updated active project")
                    : "No active project"}
                </span>
              </div>
              {featured ? (
                <div className="relative overflow-hidden pt-6 sm:pt-7">
                  <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="size-1.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />{" "}
                        Active project
                      </p>
                      <h3 className="mt-3 font-brand text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
                        <Link
                          href={`/app/projects/${featured.id}`}
                          className="rounded-sm transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          {featured.name}
                        </Link>
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                        {featured.description ||
                          "Add a description to give this project a clear objective."}
                      </p>
                    </div>
                    <div
                      className="relative flex size-32 shrink-0 items-center justify-center sm:size-36"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 size-full -rotate-90"
                        fill="none"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          stroke="var(--border)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          pathLength="100"
                          stroke="var(--primary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${featured.progress.percent} 100`}
                        />
                      </svg>
                      <div className="text-center">
                        <span className="font-brand text-3xl font-semibold tabular-nums tracking-[-0.04em]">
                          {featured.progress.percent}%
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <div
                      role="progressbar"
                      aria-label={`${featured.name} execution progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={featured.progress.percent}
                      className="sr-only"
                    ></div>
                    <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        {featured.progress.doneTasks} of{" "}
                        {featured.progress.totalTasks} tasks done
                      </span>
                      <span>
                        {featured.progress.completedMilestones} of{" "}
                        {featured.progress.totalMilestones} milestones complete
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tasks and milestones count equally toward progress.
                    </p>
                  </div>
                  <div className="relative ml-1 mt-7 grid gap-5 border-t border-border/50 pt-5 sm:grid-cols-2">
                    <div
                      className={
                        nextMilestone
                          ? "relative border-l border-border pl-4"
                          : "min-w-0"
                      }
                    >
                      {nextMilestone ? (
                        <span
                          aria-hidden="true"
                          className="absolute -left-[4.5px] top-1 size-2 rounded-full border border-primary bg-card"
                        />
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        Next milestone
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {nextMilestone?.title ?? "No upcoming milestone"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {nextMilestone
                          ? (formatShortDate(nextMilestone.target_date) ??
                            "No target date")
                          : "Add one in the project"}
                      </p>
                    </div>
                    <div
                      className={
                        followingMilestone
                          ? "relative border-l border-border pl-4"
                          : "min-w-0"
                      }
                    >
                      {followingMilestone ? (
                        <span
                          aria-hidden="true"
                          className="absolute -left-[4.5px] top-1 size-2 rounded-full border border-muted-foreground bg-card"
                        />
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        Following milestone
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {followingMilestone?.title ?? "—"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {followingMilestone
                          ? (formatShortDate(followingMilestone.target_date) ??
                            "No target date")
                          : `${featured.progress.openTasks} open ${featured.progress.openTasks === 1 ? "task" : "tasks"}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>
                      Project target:{" "}
                      {formatDate(featured.target_date) ?? "Not set"}
                    </span>
                    <Link
                      href={`/app/projects/${featured.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      Open project{" "}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-sm text-muted-foreground">
                  No active projects.{" "}
                  <Link
                    href="/app/projects"
                    className="text-foreground underline underline-offset-4"
                  >
                    View your projects
                  </Link>
                </div>
              )}
            </section>
          </div>

          <section aria-labelledby="projects-heading">
            <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <h2
                  id="projects-heading"
                  className="font-brand text-lg font-semibold"
                >
                  Project landscape
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active projects and their execution progress
                </p>
              </div>
              <Link
                href="/app/projects"
                className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
              >
                View all <span aria-hidden="true">↗</span>
              </Link>
            </div>
            {activeProjects.length ? (
              <ul className="divide-y divide-border/40">
                {activeProjects.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/app/projects/${project.id}`}
                      className="grid gap-3 py-4 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[minmax(0,1fr)_minmax(100px,180px)_5rem] sm:items-center sm:gap-6"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {project.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {project.progress.openTasks} open ·{" "}
                          {project.progress.completedMilestones}/
                          {project.progress.totalMilestones} milestones
                        </span>
                      </span>
                      <span
                        className="h-1 overflow-hidden bg-muted"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full bg-primary"
                          style={{ width: `${project.progress.percent}%` }}
                        />
                      </span>
                      <span className="text-sm tabular-nums text-muted-foreground sm:text-right">
                        {project.progress.percent}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">
                No active projects right now.
              </p>
            )}
          </section>

          <section
            aria-label="Execution summary"
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border/60 py-5 sm:grid-cols-4"
          >
            {[
              ["Active projects", metrics.activeProjects],
              ["Open tasks", metrics.openTasks],
              ["Completed tasks", metrics.completedTasks],
              ["Overdue tasks", metrics.overdueTasks],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-brand text-2xl font-semibold tabular-nums">
                  <span className="sr-only">{label}: </span>
                  {value}
                </p>
              </div>
            ))}
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
  );
}
