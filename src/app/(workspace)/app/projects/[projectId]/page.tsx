import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { MilestoneDialog } from "@/components/milestones/milestone-dialog";
import { MilestoneItem } from "@/components/milestones/milestone-item";
import { ProjectDangerActions } from "@/components/projects/project-danger-actions";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { WorkTable } from "@/components/projects/work-table";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectStatusBadge } from "@/components/tasks/task-badges";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProjectDetail } from "@/lib/data/projects";
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
        <p className="mb-6 rounded-xl border border-primary/30 bg-primary/8 px-3 py-2 text-sm text-primary">
          This project is archived. Restore it to add or move work.
        </p>
      ) : null}

      <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 lg:grid-cols-4">
        {[
          ["Status", null],
          ["Start date", formatDate(project.start_date) ?? "Not set"],
          ["Target date", formatDate(project.target_date) ?? "Not set"],
          ["Tasks", `${openTasks} open · ${doneTasks} done`],
        ].map(([label, value]) => (
          <div key={label} className="bg-card/80 p-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </p>
            <div className="mt-2">
              {value === null ? (
                <ProjectStatusBadge status={project.status} />
              ) : (
                <p className="text-sm">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="mb-8 space-y-2" aria-label="Project progress">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedItems} of {totalItems} items complete
          </span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <Progress
          value={percent}
          aria-label={`${project.name} progress`}
          className="h-1.5 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-primary [&>[data-slot=progress-indicator]]:to-chart-2"
        />
      </section>

      <WorkTable
        tasks={tasks}
        projectId={project.id}
        archived={Boolean(project.archived_at)}
      />

      <section className="mt-10" aria-labelledby="milestones-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              Checkpoints
            </p>
            <h2 id="milestones-heading" className="mt-0.5 font-display text-2xl leading-none">
              Milestones
            </h2>
            <p className="text-xs text-muted-foreground">
              {milestones.length === 0
                ? "No checkpoints yet"
                : `${completedMilestones} of ${milestones.length} complete`}
            </p>
          </div>
          {!project.archived_at ? (
            <MilestoneDialog
              projectId={project.id}
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="size-4" aria-hidden="true" />
                  Add milestone
                </Button>
              }
            />
          ) : null}
        </div>

        {milestones.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No milestones on this project. Add a checkpoint to make progress
              easier to read.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60 bg-card/30">
            {milestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                projectId={project.id}
              />
            ))}
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
