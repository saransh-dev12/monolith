import Link from "next/link";
import { CalendarDays, ListChecks } from "lucide-react";

import { ProjectStatusBadge } from "@/components/tasks/task-badges";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import type { ProjectSummary } from "@/lib/data/projects";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const targetDate = formatDate(project.target_date);

  return (
    <Link
      href={`/app/projects/${project.id}`}
      className="group glass-card relative flex flex-col overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-chart-2/30 hover:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em] transition-colors group-hover:text-primary">
          {project.name}
        </h2>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {project.description ?? "No description yet."}
      </p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="tabular-nums">{project.progress.percent}%</span>
        </div>
        <Progress
          value={project.progress.percent}
          aria-label={`${project.name} progress`}
          className="[&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-primary [&>[data-slot=progress-indicator]]:to-chart-2"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="size-3.5" aria-hidden="true" />
          {project.progress.openTasks} open · {project.progress.doneTasks} done
        </span>
        {targetDate ? (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {targetDate}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
