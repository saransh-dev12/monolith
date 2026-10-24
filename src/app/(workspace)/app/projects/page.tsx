import Link from "next/link";
import { Archive, Plus } from "lucide-react";

import { HoverLift } from "@/components/motion/hover-lift";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { listProjects } from "@/lib/data/projects";

export const metadata = {
  title: "Projects · Monolith",
};

export default async function ProjectsPage(props: PageProps<"/app/projects">) {
  const searchParams = await props.searchParams;
  const archived = searchParams.archived === "1";
  const projects = await listProjects({ archived });

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title={archived ? "Archived projects" : "Projects"}
        description={
          archived
            ? "Archived projects keep their tasks and milestones. Restore one to bring it back into active views."
            : "Every project you own, with progress derived from completed work."
        }
        actions={
          <>
            {!archived ? (
              <ProjectDialog
                trigger={
                  <Button>
                    <Plus className="size-4" aria-hidden="true" />
                    Create project
                  </Button>
                }
              />
            ) : null}
            <Button asChild variant="outline">
              <Link href={archived ? "/app/projects" : "/app/projects?archived=1"}>
                <Archive className="size-4" aria-hidden="true" />
                {archived ? "Active projects" : "Archived"}
              </Link>
            </Button>
          </>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title={archived ? "Nothing archived" : "No projects yet"}
          description={
            archived
              ? "Archived projects will appear here, with their tasks intact."
              : "Create a project to group tasks, set a target date, and track progress."
          }
          onAction={
            archived ? undefined : (
              <ProjectDialog
                trigger={
                  <Button>
                    <Plus className="size-4" aria-hidden="true" />
                    Create a project
                  </Button>
                }
              />
            )
          }
          actionHref={archived ? "/app/projects" : undefined}
          actionLabel={archived ? "Back to active projects" : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <HoverLift key={project.id}>
              <ProjectCard project={project} />
            </HoverLift>
          ))}
        </div>
      )}
    </>
  );
}
