import Link from "next/link";
import { Plus } from "lucide-react";

import { MilestonePath } from "@/components/dashboard/milestone-path";
import { CommandMotion } from "@/components/dashboard/command-motion";
import { ProgressValue } from "@/components/dashboard/progress-value";
import { ActionArrow } from "@/components/dashboard/action-arrow";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/projects";
import {
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
      <div className="command-reference-shell">
        <header className="command-reference-header">
          <div>
            <p className="text-xs text-muted-foreground">{date} · {user.displayName}&apos;s workspace</p>
            <h1 className="mt-1 font-brand text-xl font-semibold">Command Center</h1>
          </div>
          <span className="text-xs text-muted-foreground">{metrics.activeProjects} active {metrics.activeProjects === 1 ? "project" : "projects"}</span>
        </header>

        {projects.length === 0 ? (
          <section aria-labelledby="empty-projects-heading" className="command-empty-stage">
            <h2 id="empty-projects-heading" className="font-display text-4xl">No projects yet</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Create a project to bring your milestones, tasks and progress together.</p>
            <ProjectDialog trigger={<Button className="mt-6"><Plus className="size-4" aria-hidden="true" />Create a project</Button>} />
          </section>
        ) : (
          <section aria-labelledby="featured-heading" className="command-reference-layout">
            <div className="command-reference-canvas" role="region" aria-label="Project execution canvas">
              <div className="command-canvas-heading">
                <div>
                  <h2 id="featured-heading" className="text-xs font-medium text-muted-foreground">Project in focus</h2>
                  {featured ? (
                    <>
                      <h3 className="mt-2 max-w-xl font-display text-3xl leading-tight tracking-tight sm:text-5xl">
                        <Link href={`/app/projects/${featured.id}`} className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{featured.name}</Link>
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{featured.description || "Add an objective to give this project a clear direction."}</p>
                      <Link href={`/app/projects/${featured.id}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Open project <ActionArrow /></Link>
                    </>
                  ) : <p className="mt-4 text-sm text-muted-foreground">No active projects. <Link href="/app/projects" className="underline underline-offset-4">View your projects</Link></p>}
                </div>
              </div>

              {featured && (
                <>
                  <div className="command-canvas-milestones">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-brand text-sm font-semibold">The path ahead</h4>
                      <span className="text-xs text-muted-foreground">Upcoming milestones · ordered by date</span>
                    </div>
                    {featuredMilestones.length ? <MilestonePath projectId={featured.id} milestones={featuredMilestones.slice(0, 3).map((milestone) => ({ id: milestone.id, title: milestone.title, date: formatShortDate(milestone.target_date) ?? "No target date" }))} /> : <p className="mt-5 text-sm text-muted-foreground">No upcoming milestone. <Link href={`/app/projects/${featured.id}`} className="text-foreground underline underline-offset-4">Add a milestone</Link></p>}
                  </div>
                  <div className="command-canvas-bottom">
                    <section className="command-reference-panel" aria-label="Selected project progress">
                      <p className="text-xs text-muted-foreground">Execution progress</p>
                      <div className="mt-3 flex items-end justify-between gap-3"><p className="font-brand text-3xl tabular-nums"><ProgressValue value={featured.progress.percent} /></p><p className="text-right text-xs text-muted-foreground">Tasks and milestones<br />combined</p></div>
                      <div role="progressbar" aria-label={`${featured.name} execution progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={featured.progress.percent} className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div data-command-progress className="h-full rounded-full bg-primary" style={{ width: `${featured.progress.percent}%` }} /></div>
                    </section>
                    <section className="command-reference-panel" aria-label="Selected project work">
                      <p className="text-xs text-muted-foreground">Project work</p>
                      <div className="mt-3 flex items-end gap-5"><div><span className="font-brand text-2xl tabular-nums">{featured.progress.openTasks}</span><span className="ml-2 text-xs text-muted-foreground">open tasks</span></div><div><span className="font-brand text-2xl tabular-nums">{featured.progress.doneTasks}</span><span className="ml-2 text-xs text-muted-foreground">done</span></div></div>
                      <p className="mt-3 text-xs text-muted-foreground">{featured.progress.completedMilestones} of {featured.progress.totalMilestones} milestones complete · {featured.target_date ? `Target ${formatShortDate(featured.target_date)}` : "No project target"}</p>
                    </section>
                  </div>
                </>
              )}
            </div>

            <aside className="command-reference-rail" aria-label="Execution overview">
              <section aria-labelledby="focus-heading" className="command-rail-focus">
                <div className="flex items-center justify-between gap-3"><h2 id="focus-heading" className="font-brand text-base font-semibold">Next action</h2><span className="size-2 rounded-full bg-primary" aria-hidden="true" /></div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Across active projects: overdue first, then in progress, due date and priority.</p>
                {focus ? <div className="mt-4"><p className="text-xs text-muted-foreground">{focus.projectName}</p><h3 className="mt-2 font-brand text-lg leading-snug"><Link href={`/app/projects/${focus.project_id}`} className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{focus.title}</Link></h3><p className="mt-3 text-xs leading-5 text-muted-foreground">{statusLabel[focus.status]} · {focus.priority} priority · <span className={isOverdue(focus.due_date, focus.status, today) ? "text-primary" : ""}>{isOverdue(focus.due_date, focus.status, today) ? "Overdue · " : ""}{focus.due_date ? `Due ${formatShortDate(focus.due_date)}` : "No due date"}</span></p></div> : <p className="mt-4 text-sm text-muted-foreground">No open tasks in active projects.</p>}
                <Link href={focus ? `/app/projects/${focus.project_id}` : "/app/planner"} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{focus ? "Continue work" : "Open planner"} <ActionArrow /></Link>
              </section>
              <section className="command-rail-section" aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="font-brand text-base font-semibold">Execution overview</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tasks across unarchived projects</p>
                <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60">
                  {[{label:"Active projects", value:metrics.activeProjects}, {label:"Open tasks", value:metrics.openTasks}, {label:"Completed tasks", value:metrics.completedTasks}, {label:"Overdue tasks", value:metrics.overdueTasks}].map((item) => <div key={item.label} className="bg-card/95 p-3"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-2 font-brand text-2xl tabular-nums"><span className="sr-only">{item.label}: </span>{item.value}</p></div>)}
                </div>
              </section>
              <section className="command-rail-section" aria-labelledby="activity-heading">
                <div className="flex items-center justify-between gap-3"><h2 id="activity-heading" className="font-brand text-base font-semibold">Recent updates</h2></div>
                <p className="mt-1 text-xs text-muted-foreground">Latest task changes, not a complete history</p>
                {recentActivity.length ? <ol className="mt-2 divide-y divide-border/50">{recentActivity.slice(0,4).map((event) => <li key={event.id}><Link href={`/app/projects/${event.projectId}`} className="flex min-h-12 items-start gap-3 py-3 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" /><span className="min-w-0 flex-1"><span className="block truncate text-sm">{event.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{event.projectName} · {statusLabel[event.status]}</span></span><span className="shrink-0 text-xs text-muted-foreground">{relativeTime(event.updatedAt)}</span></Link></li>)}</ol> : <p className="py-5 text-sm text-muted-foreground">Task updates will appear here as work progresses.</p>}
              </section>
            </aside>

            <section aria-labelledby="projects-heading" className="command-reference-projects">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="projects-heading" className="font-brand text-base font-semibold">Project landscape</h2><p className="mt-1 text-xs text-muted-foreground">Choose an active project to inspect.</p></div><Link href="/app/projects" className="text-sm text-muted-foreground hover:text-foreground">All projects ↗</Link></div>
              {activeProjects.length ? <nav aria-label="Choose an active project" data-overflow-clip className="mt-4 flex gap-2 overflow-x-auto pb-2">{activeProjects.map((project) => <Link key={project.id} href={`/app?project=${encodeURIComponent(project.id)}`} aria-current={project.id === featured?.id ? "page" : undefined} className={`min-w-[13rem] shrink-0 rounded-lg border p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${project.id === featured?.id ? "border-primary/60 bg-primary/10" : "border-border/60 bg-card/50 hover:border-foreground/40"}`}><span className="flex justify-between gap-3 text-sm"><span className="font-medium">{project.name}</span><span className="tabular-nums">{project.progress.percent}%</span></span><span className="mt-2 block text-xs text-muted-foreground">{project.progress.openTasks} open {project.progress.openTasks === 1 ? "task" : "tasks"}</span></Link>)}</nav> : <p className="py-5 text-sm text-muted-foreground">No active projects right now.</p>}
            </section>
            <section aria-labelledby="timeline-heading" className="command-reference-timeline">
              <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3"><div><h2 id="timeline-heading" className="font-brand text-base font-semibold">Execution timeline</h2><p className="mt-1 text-xs text-muted-foreground">Task updates, deadlines and milestone targets</p></div><Link href="/app/board" className="text-sm text-muted-foreground hover:text-foreground">Open board ↗</Link></div>
              {timeline.length ? <ol>{timeline.map((event) => <li key={event.id} className="border-b border-border/40"><Link href={`/app/projects/${event.projectId}`} className="grid gap-1 py-3 text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"><span className={event.overdue ? "text-primary" : "text-muted-foreground"}>{formatShortDate(event.date)}</span><span>{event.title}<span className="block text-xs text-muted-foreground">{event.projectName}</span></span><span className={event.overdue ? "text-xs text-primary" : "text-xs text-muted-foreground"}>{event.kind}</span></Link></li>)}</ol> : <p className="py-5 text-sm text-muted-foreground">Upcoming work and recent task updates will appear here.</p>}
              <p className="mt-4 text-xs text-muted-foreground">{stageCounts.inProgress} in progress · {stageCounts.done} tasks done · {stageCounts.todo} to do across unarchived projects</p>
            </section>
          </section>
        )}
      </div>
    </CommandMotion>
  );
}
