'use client';

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { TaskItem, TaskStatus } from '../../lib/types';
import TaskCard from './task-card';
import { useTaskMutation } from '../../hooks/useTasks';

const DEFAULT_STATUSES: { id: TaskStatus; label: string; wip: number }[] = [
  { id: 'BACKLOG', label: 'Backlog', wip: 8 },
  { id: 'TODO', label: 'To do', wip: 6 },
  { id: 'IN_PROGRESS', label: 'In progress', wip: 4 },
  { id: 'REVIEW', label: 'Review', wip: 4 },
  { id: 'DONE', label: 'Done', wip: 100 }
];

export default function KanbanBoard({
  projectId,
  tasks,
  onSelectTask
}: {
  projectId: string;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
}) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const mutation = useTaskMutation(projectId);

  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_STATUSES;
    const stored = window.localStorage.getItem(`orbit-columns:${projectId}`);
    return stored ? (JSON.parse(stored) as typeof DEFAULT_STATUSES) : DEFAULT_STATUSES;
  });

  const grouped = useMemo(() => {
    return columns.map((status) => ({
      status: status.id,
      label: status.label,
      wip: status.wip,
      tasks: tasks.filter((task) => task.status === status.id).sort((a, b) => a.order - b.order)
    }));
  }, [tasks, columns]);

  function moveColumn(index: number, dir: -1 | 1) {
    const next = arrayMove(columns, index, index + dir);
    setColumns(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`orbit-columns:${projectId}`, JSON.stringify(next));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const [overStatus, overTaskId] = String(over.id).split('|');
    const status = (overStatus as TaskStatus) || activeTask.status;

    if (status !== activeTask.status) {
      mutation.mutate({ id: activeTask.id, status, order: 0 });
      return;
    }

    const columnTasks = tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
    const oldIndex = columnTasks.findIndex((task) => task.id === activeTask.id);
    const newIndex = columnTasks.findIndex((task) => task.id === overTaskId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(columnTasks, oldIndex, newIndex);
    reordered.forEach((task, index) => {
      mutation.mutate({ id: task.id, order: index });
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {grouped.map((column, index) => (
          <div key={column.status} className="flex min-w-[260px] flex-col gap-4 md:min-w-0">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {column.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                    column.tasks.length > column.wip ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-ink-500'
                  }`}
                >
                  {column.tasks.length}/{column.wip}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded border border-slate-200 px-1 text-xs"
                  onClick={() => moveColumn(index, -1)}
                  disabled={index === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="rounded border border-slate-200 px-1 text-xs"
                  onClick={() => moveColumn(index, 1)}
                  disabled={index === grouped.length - 1}
                >
                  →
                </button>
              </div>
            </div>
            <SortableContext items={column.tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
              <div className="flex min-h-[120px] flex-col gap-3 rounded-2xl border border-dashed border-slate-200 p-2">
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onSelect={onSelectTask} status={column.status} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
