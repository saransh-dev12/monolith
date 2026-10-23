import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Clock,
  FolderKanban,
  ListChecks,
  Plus,
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
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Command Center · Monolith",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const { metrics, projects } = await getDashboardData();

  return (
    <>
      <PageHeader
        title={`Command Center`}
        description={`${user.displayName}, here is the current state of your work. Every number comes from your own rows.`}
        actions={
          <ProjectDialog
            trigger={
              <Button>
                <Plus className="size-4" aria-hidden="true" />
                New project
              </Button>
            }
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <section className="mt-10 space-y-4">
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
                    <p className="truncate text-sm font-medium">{project.name}</p>
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
                <div className="flex w-full items-center gap-3 sm:w-56">
                  <Progress value={project.progress.percent} />
                  <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {project.progress.percent}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
