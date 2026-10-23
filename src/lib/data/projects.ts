import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Milestone, Project, Task } from "@/types/database";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/lib/validation/schemas";

export type ProjectProgress = {
  totalTasks: number;
  doneTasks: number;
  openTasks: number;
  totalMilestones: number;
  completedMilestones: number;
  percent: number;
};

export type ProjectSummary = Project & {
  progress: ProjectProgress;
};

export type ProjectDetail = {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
};

function emptyProgress(): ProjectProgress {
  return {
    totalTasks: 0,
    doneTasks: 0,
    openTasks: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    percent: 0,
  };
}

function computePercent(progress: ProjectProgress): number {
  const total = progress.totalTasks + progress.totalMilestones;
  const completed = progress.doneTasks + progress.completedMilestones;

  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export async function listProjects(options?: {
  archived?: boolean;
}): Promise<ProjectSummary[]> {
  const supabase = await createClient();
  const archived = options?.archived ?? false;

  const query = supabase.from("projects").select("*");
  const filtered = archived
    ? query.not("archived_at", "is", null)
    : query.is("archived_at", null);

  const { data: projects, error } = await filtered.order("updated_at", {
    ascending: false,
  });

  if (error) {
    throw new Error(`Could not load projects: ${error.message}`);
  }

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  const [tasksResult, milestonesResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("project_id,status")
      .in("project_id", projectIds),
    supabase
      .from("milestones")
      .select("project_id,completed_at")
      .in("project_id", projectIds),
  ]);

  if (tasksResult.error) {
    throw new Error(`Could not load task counts: ${tasksResult.error.message}`);
  }

  if (milestonesResult.error) {
    throw new Error(
      `Could not load milestone counts: ${milestonesResult.error.message}`,
    );
  }

  const progressByProject = new Map<string, ProjectProgress>();

  for (const project of projects) {
    progressByProject.set(project.id, emptyProgress());
  }

  for (const task of tasksResult.data) {
    const progress = progressByProject.get(task.project_id);
    if (!progress) {
      continue;
    }

    progress.totalTasks += 1;
    if (task.status === "done") {
      progress.doneTasks += 1;
    } else {
      progress.openTasks += 1;
    }
  }

  for (const milestone of milestonesResult.data) {
    const progress = progressByProject.get(milestone.project_id);
    if (!progress) {
      continue;
    }

    progress.totalMilestones += 1;
    if (milestone.completed_at) {
      progress.completedMilestones += 1;
    }
  }

  return projects.map((project) => {
    const progress = progressByProject.get(project.id) ?? emptyProgress();
    return { ...project, progress: { ...progress, percent: computePercent(progress) } };
  });
}

export async function getProjectDetail(
  projectId: string,
): Promise<ProjectDetail | null> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load project: ${error.message}`);
  }

  if (!project) {
    return null;
  }

  const [tasksResult, milestonesResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("target_date", { ascending: true, nullsFirst: false }),
  ]);

  if (tasksResult.error) {
    throw new Error(`Could not load tasks: ${tasksResult.error.message}`);
  }

  if (milestonesResult.error) {
    throw new Error(
      `Could not load milestones: ${milestonesResult.error.message}`,
    );
  }

  return {
    project,
    tasks: tasksResult.data,
    milestones: milestonesResult.data,
  };
}

export type BoardData = {
  projects: Pick<Project, "id" | "name">[];
  tasks: (Task & { projectName: string })[];
};

export async function getBoardData(): Promise<BoardData> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id,name")
    .is("archived_at", null)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load the board: ${error.message}`);
  }

  if (projects.length === 0) {
    return { projects: [], tasks: [] };
  }

  const projectNames = new Map(projects.map((project) => [project.id, project.name]));

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .in(
      "project_id",
      projects.map((project) => project.id),
    )
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (tasksError) {
    throw new Error(`Could not load board tasks: ${tasksError.message}`);
  }

  return {
    projects,
    tasks: tasks.map((task) => ({
      ...task,
      projectName: projectNames.get(task.project_id) ?? "Project",
    })),
  };
}

export type DashboardTask = Pick<
  Task,
  "id" | "project_id" | "title" | "status" | "priority" | "due_date"
> & { projectName: string };

export type DashboardData = {
  metrics: {
    activeProjects: number;
    openTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  projects: ProjectSummary[];
  nextTasks: DashboardTask[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load the dashboard: ${error.message}`);
  }

  if (projects.length === 0) {
    return {
      metrics: {
        activeProjects: 0,
        openTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
      },
      projects: [],
      nextTasks: [],
    };
  }

  const projectIds = projects.map((project) => project.id);
  const today = new Date().toISOString().slice(0, 10);

  const [tasksResult, milestonesResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("id,project_id,title,status,priority,due_date")
      .in("project_id", projectIds),
    supabase
      .from("milestones")
      .select("project_id,completed_at")
      .in("project_id", projectIds),
  ]);

  if (tasksResult.error) {
    throw new Error(`Could not load task metrics: ${tasksResult.error.message}`);
  }

  if (milestonesResult.error) {
    throw new Error(
      `Could not load milestone metrics: ${milestonesResult.error.message}`,
    );
  }

  const progressByProject = new Map<string, ProjectProgress>();
  for (const project of projects) {
    progressByProject.set(project.id, emptyProgress());
  }

  let openTasks = 0;
  let completedTasks = 0;
  let overdueTasks = 0;

  for (const task of tasksResult.data) {
    const progress = progressByProject.get(task.project_id);
    if (!progress) {
      continue;
    }

    progress.totalTasks += 1;

    if (task.status === "done") {
      completedTasks += 1;
      progress.doneTasks += 1;
    } else {
      openTasks += 1;
      progress.openTasks += 1;

      if (task.due_date && task.due_date < today) {
        overdueTasks += 1;
      }
    }
  }

  for (const milestone of milestonesResult.data) {
    const progress = progressByProject.get(milestone.project_id);
    if (!progress) {
      continue;
    }

    progress.totalMilestones += 1;
    if (milestone.completed_at) {
      progress.completedMilestones += 1;
    }
  }

  const projectNames = new Map(
    projects.map((project) => [project.id, project.name]),
  );

  const nextTasks = tasksResult.data
    .filter((task) => task.status !== "done")
    .sort((left, right) => {
      if (left.due_date && right.due_date) {
        return left.due_date.localeCompare(right.due_date);
      }
      if (left.due_date) return -1;
      if (right.due_date) return 1;
      return left.title.localeCompare(right.title);
    })
    .slice(0, 5)
    .map((task) => ({
      ...task,
      projectName: projectNames.get(task.project_id) ?? "Project",
    }));

  return {
    metrics: {
      activeProjects: projects.filter((project) => project.status === "active")
        .length,
      openTasks,
      completedTasks,
      overdueTasks,
    },
    projects: projects.map((project) => {
      const progress = progressByProject.get(project.id) ?? emptyProgress();
      return {
        ...project,
        progress: { ...progress, percent: computePercent(progress) },
      };
    }),
    nextTasks,
  };
}

export async function createProject(
  ownerId: string,
  input: ProjectCreateInput,
) {
  const supabase = await createClient();

  return supabase
    .from("projects")
    .insert({
      owner_id: ownerId,
      name: input.name,
      description: input.description ?? null,
      status: input.status,
      start_date: input.startDate ?? null,
      target_date: input.targetDate ?? null,
    })
    .select()
    .single();
}

export async function updateProject(
  projectId: string,
  input: ProjectUpdateInput,
) {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("projects")
    .select("start_date,target_date")
    .eq("id", projectId)
    .maybeSingle();

  if (readError) {
    return { data: null, error: readError };
  }

  if (!existing) {
    return { data: null, error: null };
  }

  const startDate =
    input.startDate !== undefined ? input.startDate : existing.start_date;
  const targetDate =
    input.targetDate !== undefined ? input.targetDate : existing.target_date;

  if (startDate && targetDate && targetDate < startDate) {
    return {
      data: null,
      error: {
        message: "Target date must be on or after the start date.",
        details: "",
        hint: "",
        code: "date_order",
      },
    };
  }

  return supabase
    .from("projects")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startDate !== undefined ? { start_date: input.startDate } : {}),
      ...(input.targetDate !== undefined
        ? { target_date: input.targetDate }
        : {}),
    })
    .eq("id", projectId)
    .select()
    .single();
}

export async function setProjectArchived(projectId: string, archived: boolean) {
  const supabase = await createClient();

  return supabase
    .from("projects")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", projectId)
    .select()
    .single();
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  return supabase.from("projects").delete().eq("id", projectId).select("id");
}
