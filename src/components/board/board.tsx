"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  snapshotSupersedesOverride,
  type BoardOverride,
} from "@/lib/board-overrides";
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
  disabled = false,
  onStatusChange,
}: {
  task: BoardTask;
  dragging?: boolean;
  overlay?: boolean;
  handle?: React.ReactNode;
  disabled?: boolean;
  onStatusChange?: (status: TaskStatus) => void;
}) {
  const dueDate = formatShortDate(task.due_date);
  const overdue = isOverdue(task.due_date, task.status);
  return (
    <motion.article
      data-motion-lift
      whileHover={overlay || dragging ? undefined : { y: -5 }}
      transition={springLift}
      className={cn(
        "space-y-3 rounded-xl border border-border/70 bg-card/90 p-4 transition-[border-color,opacity] duration-150 hover:border-primary/35",
        dragging && "opacity-40",
        overlay && "rotate-[1deg] border-primary/50 shadow-2xl shadow-black/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1.5">
          <Link
            href={`/app/projects/${task.project_id}`}
            className="eyebrow text-muted-foreground hover:text-foreground"
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
              overdue ? "text-primary" : "text-muted-foreground",
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
          disabled={disabled}
          onStatusChange={onStatusChange}
        />
      ) : null}
    </motion.article>
  );
}

function DraggableCard({
  task,
  disabled,
  onStatusChange,
}: {
  task: BoardTask;
  disabled: boolean;
  onStatusChange: (status: TaskStatus) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
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
      className="shrink-0 cursor-grab rounded p-1 text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-wait disabled:opacity-40"
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
      <BoardCard
        task={task}
        dragging={isDragging}
        handle={handle}
        disabled={disabled}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}

function BoardColumn({
  status,
  tasks,
  movingIds,
  onMoveTask,
}: {
  status: TaskStatus;
  tasks: BoardTask[];
  movingIds: Set<string>;
  onMoveTask: (task: BoardTask, status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${status}`}
      className={cn(
        "flex min-h-40 flex-col rounded-2xl border transition-colors duration-200",
        isOver
          ? "border-primary/60 bg-primary/[0.06] ring-2 ring-primary/25"
          : "border-border/60 bg-card/50 backdrop-blur-sm",
      )}
    >
      <header className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "todo"
                ? "bg-foreground/50"
                : status === "in_progress"
                  ? "bg-primary"
                  : "bg-chart-3",
            )}
            aria-hidden="true"
          />
          <h2 id={`column-${status}`} className="text-xs font-medium text-muted-foreground">
            {TASK_STATUS_LABELS[status]}
          </h2>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {String(tasks.length)}
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
              onStatusChange={(nextStatus) => onMoveTask(task, nextStatus)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export function Board({ tasks }: { tasks: BoardTask[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, BoardOverride>>({});
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set());
  const pendingIds = useRef(new Set<string>());
  const router = useRouter();

  // Retain an optimistic value until a refreshed server snapshot confirms it.
  useEffect(() => {
    setOverrides((current) => {
      const next = { ...current };
      let changed = false;
      for (const task of tasks) {
        if (
          !pendingIds.current.has(task.id) &&
          next[task.id] &&
          snapshotSupersedesOverride(task, next[task.id])
        ) {
          delete next[task.id];
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [tasks, overrides, movingIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const resolvedTasks = tasks.map((task) => ({
    ...task,
    status: overrides[task.id]?.status ?? task.status,
  }));

  const activeTask = resolvedTasks.find((task) => task.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function moveTask(task: BoardTask, nextStatus: TaskStatus) {
    if (task.status === nextStatus || pendingIds.current.has(task.id)) {
      return;
    }

    const previousOverride = overrides[task.id];
    pendingIds.current.add(task.id);
    setOverrides((current) => ({
      ...current,
      [task.id]: { status: nextStatus },
    }));
    setMovingIds((current) => new Set(current).add(task.id));

    const result = await apiRequest<{ task: Task }>(
      `/api/tasks/${task.id}/status`,
      "PATCH",
      { status: nextStatus },
    );

    pendingIds.current.delete(task.id);
    setMovingIds((current) => {
      const next = new Set(current);
      next.delete(task.id);
      return next;
    });

    if (!result.ok) {
      setOverrides((current) => {
        const next = { ...current };
        if (previousOverride) next[task.id] = previousOverride;
        else delete next[task.id];
        return next;
      });
      toast.error(result.message);
      return;
    }

    setOverrides((current) => ({
      ...current,
      [task.id]: {
        status: result.data.task.status,
        confirmedAt: result.data.task.updated_at,
      },
    }));
    toast.success(`Moved to ${TASK_STATUS_LABELS[nextStatus]}.`);
    router.refresh();
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const overStatus = event.over?.id;

    setActiveId(null);

    if (!overStatus || !TASK_STATUS_ORDER.includes(overStatus as TaskStatus)) {
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
      <p className="mb-4 flex items-center gap-2 eyebrow text-muted-foreground">
        <span className="size-1.5 rounded-full bg-chart-2" aria-hidden="true" />
        Drag the grip to move work · the status menu is the keyboard fallback
      </p>
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {TASK_STATUS_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={resolvedTasks.filter((task) => task.status === status)}
            movingIds={movingIds}
            onMoveTask={(task, status) => void moveTask(task, status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <motion.div
            data-motion-reveal
            initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <BoardCard task={activeTask} overlay />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
