import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Board } from "@/components/board/board";
import { WeekStrip } from "@/components/dashboard/execution-chart";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { getBoardData, getExecutionSeries } from "@/lib/data/projects";

export const metadata = {
  title: "Board · Monolith",
};

export default async function BoardPage() {
  const [{ projects, tasks }, series] = await Promise.all([
    getBoardData(),
    getExecutionSeries(30),
  ]);

  return (
    <>
      <PageHeader
        title="Board"
        eyebrow="Execution"
        description="Move work between columns. Changes save immediately and stay keyboard accessible."
        actions={
          tasks.length > 0 ? (
            <Button asChild variant="outline">
              <Link href="/app/projects">
                Manage projects
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No active projects"
          description="Create an active project first, then its tasks will appear on this board."
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
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks on the board"
          description="Open a project and add tasks to see them organized by status."
          actionHref="/app/projects"
          actionLabel="Open projects"
        />
      ) : (
        <>
          <div className="mb-6 max-w-sm">
            <WeekStrip series={series} />
          </div>
          <Board tasks={tasks} />
        </>
      )}
    </>
  );
}
