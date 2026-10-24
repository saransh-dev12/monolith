import type { ProjectStatus, TaskPriority, TaskStatus } from "@/types/database";

export type DemoTask = {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  assignee: string;
};

export const demoProjects: Array<{
  id: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  progress: number;
  due: string;
  open: number;
  total: number;
}> = [
  {
    id: "harbor",
    name: "Harbor onboarding",
    summary: "Guided setup for first-week activation",
    status: "active",
    progress: 68,
    due: "Nov 14",
    open: 6,
    total: 18,
  },
  {
    id: "northwind",
    name: "Northwind migration",
    summary: "Move reporting workloads without downtime",
    status: "active",
    progress: 42,
    due: "Dec 02",
    open: 11,
    total: 19,
  },
  {
    id: "atlas",
    name: "Atlas billing rewrite",
    summary: "Replace invoice engine, keep ledger parity",
    status: "active",
    progress: 25,
    due: "Dec 19",
    open: 9,
    total: 12,
  },
  {
    id: "orbit",
    name: "Orbit design system",
    summary: "Shared primitives across three surfaces",
    status: "completed",
    progress: 100,
    due: "Oct 08",
    open: 0,
    total: 14,
  },
];

export const demoTasks: DemoTask[] = [
  { id: "t1", title: "Map activation moments", project: "Harbor", status: "in_progress", priority: "high", due: "Oct 27", assignee: "RS" },
  { id: "t2", title: "Draft invite email sequence", project: "Harbor", status: "todo", priority: "medium", due: "Oct 29", assignee: "MK" },
  { id: "t3", title: "Wire empty-state checklist", project: "Harbor", status: "in_progress", priority: "medium", due: "Oct 30", assignee: "AD" },
  { id: "t4", title: "Instrument step completion", project: "Harbor", status: "done", priority: "low", due: "Oct 22", assignee: "RS" },
  { id: "t5", title: "Audit export parity", project: "Northwind", status: "todo", priority: "high", due: "Nov 01", assignee: "JP" },
  { id: "t6", title: "Backfill ledger snapshots", project: "Northwind", status: "in_progress", priority: "high", due: "Nov 04", assignee: "MK" },
  { id: "t7", title: "Freeze legacy write paths", project: "Northwind", status: "todo", priority: "medium", due: "Nov 08", assignee: "AD" },
  { id: "t8", title: "Reconcile tax tables", project: "Atlas", status: "todo", priority: "high", due: "Nov 06", assignee: "JP" },
  { id: "t9", title: "Review proration rules", project: "Atlas", status: "in_progress", priority: "medium", due: "Nov 11", assignee: "RS" },
  { id: "t10", title: "Publish token docs", project: "Orbit", status: "done", priority: "low", due: "Oct 08", assignee: "MK" },
];

export const demoMilestones = [
  { name: "Activation map approved", project: "Harbor", due: "Oct 24", done: true },
  { name: "Guided checklist shipped", project: "Harbor", due: "Nov 01", done: false },
  { name: "Cutover rehearsal", project: "Northwind", due: "Nov 18", done: false },
  { name: "Ledger parity signed off", project: "Atlas", due: "Dec 12", done: false },
];

export const demoSeries = [
  4, 6, 3, 5, 7, 4, 8, 6, 9, 5, 7, 10, 8, 12, 9, 11, 13, 10, 12, 15, 11, 14, 16, 13,
  15, 18, 14, 17, 19, 16,
];

export const demoWeek = [
  { day: "M", value: 3 },
  { day: "T", value: 5 },
  { day: "W", value: 2 },
  { day: "T", value: 6 },
  { day: "F", value: 4 },
  { day: "S", value: 1 },
  { day: "S", value: 0 },
];

export const demoStatusOrder: TaskStatus[] = ["todo", "in_progress", "done"];

export const demoStatusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const demoPriorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const conceptMeta = {
  brutalism: {
    letter: "A",
    name: "Chromatic Brutalism",
    route: "/concepts/brutalism",
    personality: "Bold, graphic, confident",
    colors: ["#D8FF00", "#2B4BFF", "#FF3B1F", "#0B0B0B", "#F5F3EC"],
    type: "Archivo Black / Space Mono",
    motion: "Hard cuts, clip wipes, marquee",
  },
  atelier: {
    letter: "B",
    name: "Kinetic Digital Atelier",
    route: "/concepts/atelier",
    personality: "Fluid, spatial, immersive",
    colors: ["#FF7A59", "#B49CFF", "#6FF2C4", "#08060F", "#171034"],
    type: "Instrument Serif / Manrope",
    motion: "Slow springs, depth, morphs",
  },
  editorial: {
    letter: "C",
    name: "Neo-Editorial Control Room",
    route: "/concepts/editorial",
    personality: "Precise, typographic, dense",
    colors: ["#8A2B22", "#1F35C4", "#14110D", "#F1ECE2", "#D8CFBE"],
    type: "Bodoni Moda / Inter Tight",
    motion: "Ruled wipes, stagger, draws",
  },
} as const;
