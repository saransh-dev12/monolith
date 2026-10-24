"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { CalendarDays, GripVertical } from "lucide-react";
import { toast } from "sonner";

import {
  OverdueBadge,
  TaskPriorityBadge,
} from "@/components/tasks/task-badges";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { apiRequest } from "@/lib/client/api";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/constants";
import { formatShortDate, isOverdue } from "@/lib/format";
import { springLift } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/database";

type BoardTask = Task & { projectName: string };

const boardCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0
    ? pointerCollisions
    : closestCorners(args);
};

function BoardCard({
  task,
  dragging = false,
  overlay = false,
  handle,
}: {
  task: BoardTask;
  dragging?: boolean;
  overlay?: boolean;
  handle?: React.ReactNode;
}) {
  const dueDate = formatShortDate(task.due_date);
  const overdue = isOverdue(task.due_date, task.status);
  return (
    <motion.article
      data-motion-lift
      whileHover={overlay || dragging ? undefined : { y: -2 }}
      transition={springLift}
      className={cn(
        "space-y-3 rounded-md border border-border/60 bg-card p-3 transition-[box-shadow,border-color,opacity] duration-150",
        dragging && "opacity-40",
        overlay &&
          "rotate-[0.5deg] border-primary/40 shadow-xl shadow-black/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1.5">
          <Link
            href={`/app/projects/${task.project_id}`}
            className="text-[11px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            {task.projectName}
          </Link>
          <p
            className={cn(
              "text-sm font-medium leading-5",
              task.status === "done" && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
        </div>
        {handle}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TaskPriorityBadge priority={task.priority} />
        {dueDate ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              overdue ? "text-rose-300" : "text-muted-foreground",
            )}
          >
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {dueDate}
          </span>
        ) : null}
        {overdue ? <OverdueBadge /> : null}
      </div>

      {!overlay ? (
        <TaskStatusSelect
          taskId={task.id}
          status={task.status}
          taskTitle={task.title}
        />
      ) : null}
    </motion.article>
  );
}

function DraggableCard({
  task,
  disabled,
}: {
  task: BoardTask;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      disabled,
      data: { status: task.status },
    });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      aria-label={`Drag ${task.title}`}
      disabled={disabled}
      className="shrink-0 cursor-grab rounded p-1 text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-wait disabled:opacity-40"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn("touch-none", isDragging && "z-10")}
    >
      <BoardCard task={task} dragging={isDragging} handle={handle} />
    </div>
  );
}

function BoardColumn({
  status,
  tasks,
  movingIds,
}: {
  status: TaskStatus;
  tasks: BoardTask[];
  movingIds: Set<string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${status}`}
      className={cn(
        "flex min-h-40 flex-col rounded-lg border bg-card/20 transition-colors duration-150",
        isOver
          ? "border-primary/50 bg-primary/5"
          : "border-border/60",
      )}
    >
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h2 id={`column-${status}`} className="text-sm font-medium">
          {TASK_STATUS_LABELS[status]}
        </h2>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-border/60 px-3 py-6 text-center text-xs text-muted-foreground">
            {isOver ? "Drop here" : "Nothing here."}
          </p>
        ) : (
          tasks.map((task) => (
            <DraggableCard
              key={`${task.id}-${task.status}`}
              task={task}
              disabled={movingIds.has(task.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export function Board({ tasks }: { tasks: BoardTask[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, TaskStatus>>({});
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const resolvedTasks = tasks.map((task) => ({
    ...task,
    status: overrides[task.id] ?? task.status,
  }));

  const activeTask = resolvedTasks.find((task) => task.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function moveTask(task: BoardTask, nextStatus: TaskStatus) {
    if (task.status === nextStatus) {
      return;
    }

    setOverrides((current) => ({ ...current, [task.id]: nextStatus }));
    setMovingIds((current) => new Set(current).add(task.id));

    const result = await apiRequest<{ task: Task }>(
      `/api/tasks/${task.id}/status`,
      "PATCH",
      { status: nextStatus },
    );

    setMovingIds((current) => {
      const next = new Set(current);
      next.delete(task.id);
      return next;
    });

    if (!result.ok) {
      setOverrides((current) => {
        const next = { ...current };
        delete next[task.id];
        return next;
      });
      toast.error(result.message);
      return;
    }

    toast.success(`Moved to ${TASK_STATUS_LABELS[nextStatus]}.`);
    router.refresh();
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const overStatus = event.over?.id;

    setActiveId(null);

    if (
      !overStatus ||
      !TASK_STATUS_ORDER.includes(overStatus as TaskStatus)
    ) {
      return;
    }

    const task = resolvedTasks.find((candidate) => candidate.id === taskId);
    if (!task) {
      return;
    }

    void moveTask(task, overStatus as TaskStatus);
  }

  return (
    <DndContext
      id="monolith-board"
      sensors={sensors}
      collisionDetection={boardCollisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <p className="mb-3 text-xs text-muted-foreground">
        Drag the grip to change a task&apos;s column. The status menu is the
        fully keyboard-accessible fallback.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {TASK_STATUS_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={resolvedTasks.filter((task) => task.status === status)}
            movingIds={movingIds}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <motion.div
            data-motion-reveal
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            <BoardCard task={activeTask} overlay />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
