import "server-only";

import { createClient } from "@/lib/supabase/server";
import { fetchAll, fetchByProjectBatches } from "@/lib/data/pagination";
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

  const projects = await fetchAll((from, to) => {
    const query = supabase.from("projects").select("*", { count: "exact" });
    return (archived ? query.not("archived_at", "is", null) : query.is("archived_at", null))
      .order("updated_at", { ascending: false }).order("id").range(from, to);
  }, "Could not load projects");

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  const [tasks, milestones] = await Promise.all([
    fetchByProjectBatches(projectIds, (ids) => fetchAll((from, to) => supabase
      .from("tasks").select("project_id,status", { count: "exact" }).in("project_id", ids)
      .order("id").range(from, to), "Could not load task counts")),
    fetchByProjectBatches(projectIds, (ids) => fetchAll((from, to) => supabase
      .from("milestones").select("project_id,completed_at", { count: "exact" }).in("project_id", ids)
      .order("id").range(from, to), "Could not load milestone counts")),
  ]);

  const progressByProject = new Map<string, ProjectProgress>();

  for (const project of projects) {
    progressByProject.set(project.id, emptyProgress());
  }

  for (const task of tasks) {
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

  for (const milestone of milestones) {
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
    .select("*", { count: "exact" })
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load project: ${error.message}`);
  }

  if (!project) {
    return null;
  }

  const [tasks, milestones] = await Promise.all([
    fetchAll((from, to) => supabase.from("tasks").select("*", { count: "exact" })
      .eq("project_id", projectId).order("position").order("created_at").order("id")
      .range(from, to), "Could not load tasks"),
    fetchAll((from, to) => supabase.from("milestones").select("*", { count: "exact" })
      .eq("project_id", projectId).order("target_date", { ascending: true, nullsFirst: false })
      .order("id").range(from, to), "Could not load milestones"),
  ]);
  return { project, tasks, milestones };
}

export type BoardData = {
  projects: Pick<Project, "id" | "name">[];
  tasks: (Task & { projectName: string })[];
};

export async function getBoardData(): Promise<BoardData> {
  const supabase = await createClient();

  const projects = await fetchAll((from, to) => supabase.from("projects").select("id,name", { count: "exact" })
    .is("archived_at", null).eq("status", "active")
    .order("updated_at", { ascending: false }).order("id").range(from, to), "Could not load the board");

  if (projects.length === 0) {
    return { projects: [], tasks: [] };
  }

  const projectNames = new Map(projects.map((project) => [project.id, project.name]));

  const tasks = await fetchByProjectBatches(projects.map((project) => project.id), (ids) =>
    fetchAll((from, to) => supabase.from("tasks").select("*", { count: "exact" }).in("project_id", ids)
      .order("position").order("created_at").order("id").range(from, to), "Could not load board tasks"));
  tasks.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));

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
  "id" | "project_id" | "title" | "status" | "priority" | "due_date" | "updated_at"
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
  stageCounts: { todo: number; inProgress: number; done: number };
  inProgressTasks: DashboardTask[];
  upcomingTasks: Array<DashboardTask & { overdue: boolean }>;
  recentActivity: Array<{
    id: string;
    title: string;
    status: Task["status"];
    projectId: string;
    projectName: string;
    updatedAt: string;
  }>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const projects = await fetchAll((from, to) => supabase.from("projects").select("*", { count: "exact" })
    .is("archived_at", null).order("updated_at", { ascending: false }).order("id")
    .range(from, to), "Could not load the dashboard");

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
      stageCounts: { todo: 0, inProgress: 0, done: 0 },
      inProgressTasks: [],
      upcomingTasks: [],
      recentActivity: [],
    };
  }

  const projectIds = projects.map((project) => project.id);
  const [tasks, milestones, totalsResult] = await Promise.all([
    fetchByProjectBatches(projectIds, (ids) => fetchAll((from, to) => supabase.from("tasks")
      .select("id,project_id,title,status,priority,due_date,updated_at", { count: "exact" }).in("project_id", ids)
      .order("id").range(from, to), "Could not load task metrics")),
    fetchByProjectBatches(projectIds, (ids) => fetchAll((from, to) => supabase.from("milestones")
      .select("project_id,completed_at", { count: "exact" }).in("project_id", ids)
      .order("id").range(from, to), "Could not load milestone metrics")),
    supabase.rpc("dashboard_totals"),
  ]);
  if (totalsResult.error || !totalsResult.data?.[0]) {
    throw new Error("Could not load dashboard totals");
  }
  const totals = totalsResult.data[0];

  const progressByProject = new Map<string, ProjectProgress>();
  for (const project of projects) {
    progressByProject.set(project.id, emptyProgress());
  }

  for (const task of tasks) {
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

  for (const milestone of milestones) {
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

  const nextTasks = tasks
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

  const stageCounts = tasks.reduce(
    (counts, task) => {
      if (task.status === "todo") counts.todo += 1;
      else if (task.status === "in_progress") counts.inProgress += 1;
      else counts.done += 1;
      return counts;
    },
    { todo: 0, inProgress: 0, done: 0 },
  );

  // "What am I working on right now?" — live in-progress tasks, most
  // recently touched first.
  const inProgressTasks = tasks
    .filter((task) => task.status === "in_progress")
    .sort((left, right) => (right.updated_at ?? "").localeCompare(left.updated_at ?? ""))
    .slice(0, 4)
    .map((task) => ({
      ...task,
      projectName: projectNames.get(task.project_id) ?? "Project",
    }));

  // "What needs my attention?" — overdue first, then deadlines inside the
  // next 7 days.
  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
  const upcomingTasks = tasks
    .filter((task) => {
      if (task.status === "done") return false;
      if (!task.due_date) return false;
      return task.due_date <= horizon;
    })
    .sort((left, right) => {
      const leftOverdue = (left.due_date ?? "") < today ? 0 : 1;
      const rightOverdue = (right.due_date ?? "") < today ? 0 : 1;
      if (leftOverdue !== rightOverdue) return leftOverdue - rightOverdue;
      return (left.due_date ?? "").localeCompare(right.due_date ?? "");
    })
    .slice(0, 6)
    .map((task) => ({
      ...task,
      projectName: projectNames.get(task.project_id) ?? "Project",
      overdue: Boolean(task.due_date && task.due_date < today),
    }));

  // "What changed recently?" — the latest task touches across the workspace.
  const recentActivity = [...tasks]
    .sort((left, right) => (right.updated_at ?? "").localeCompare(left.updated_at ?? ""))
    .slice(0, 6)
    .map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      projectId: task.project_id,
      projectName: projectNames.get(task.project_id) ?? "Project",
      updatedAt: task.updated_at ?? "",
    }));

  return {
    metrics: {
      activeProjects: totals.active_projects,
      openTasks: totals.open_tasks,
      completedTasks: totals.completed_tasks,
      overdueTasks: totals.overdue_tasks,
    },
    projects: projects.map((project) => {
      const progress = progressByProject.get(project.id) ?? emptyProgress();
      return {
        ...project,
        progress: { ...progress, percent: computePercent(progress) },
      };
    }),
    nextTasks,
    stageCounts,
    inProgressTasks,
    upcomingTasks,
    recentActivity,
  };
}

export type ExecutionDay = {
  date: string;
  label: string;
  created: number;
  completed: number;
};

/** Daily activity uses the last update of currently done tasks as its date. */
export async function getExecutionSeries(days = 30): Promise<ExecutionDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("dashboard_execution_series", { p_days: days });
  if (error || !data) throw new Error("Could not load execution data");
  return data.map((row) => ({
    date: row.day,
    label: new Date(`${row.day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    created: row.created,
    completed: row.completed,
  }));
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
