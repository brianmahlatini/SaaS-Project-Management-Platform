'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem, TaskStatus } from '../../lib/types';

export default function TaskCard({
  task,
  onSelect,
  status
}: {
  task: TaskItem;
  onSelect: (task: TaskItem) => void;
  status: TaskStatus;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      onClick={() => onSelect(task)}
      data-status={status}
      className={`w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      <div className="text-sm font-semibold text-ink-900">{task.title}</div>
      {task.description ? <div className="mt-2 text-xs text-ink-500">{task.description}</div> : null}
      <div className="mt-3 text-[11px] uppercase tracking-wide text-ink-400">Priority {task.priority}</div>
    </button>
  );
}
