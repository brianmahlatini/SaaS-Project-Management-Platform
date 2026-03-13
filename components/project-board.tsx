'use client';

import { useMemo, useState } from 'react';
import KanbanBoard from './kanban/kanban-board';
import { useCreateTask, useTasks } from '../hooks/useTasks';
import { TaskItem, TaskStatus } from '../lib/types';
import TaskPanel from './task-panel';

const STATUS_OPTIONS: { value: TaskStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All tasks' },
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' }
];

export default function ProjectBoard({ projectId, workspaceId }: { projectId: string; workspaceId: string }) {
  const { data: tasks = [] } = useTasks(projectId);
  const createTask = useCreateTask(projectId);
  const [selected, setSelected] = useState<TaskItem | null>(null);
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [compact, setCompact] = useState(false);

  async function handleCreate(formData: FormData) {
    const title = String(formData.get('title'));
    if (!title) return;
    await createTask.mutateAsync({ title, description: String(formData.get('description')) });
  }

  const filtered = useMemo(() => {
    if (filter === 'ALL') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <form action={handleCreate} className="flex flex-col gap-2 sm:flex-row">
          <input
            name="title"
            placeholder="New task"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
          />
          <input
            name="description"
            placeholder="Short description"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
          />
          <button className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Add</button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as 'ALL' | TaskStatus)}
            className="rounded-full border border-slate-200 px-3 py-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCompact((prev) => !prev)}
            className="rounded-full border border-slate-200 px-3 py-2"
          >
            {compact ? 'Comfort view' : 'Compact view'}
          </button>
          <span className="text-ink-500">{filtered.length} tasks</span>
        </div>

        <div className={compact ? 'scale-[0.98] origin-top-left' : ''}>
          <KanbanBoard projectId={projectId} tasks={filtered} onSelectTask={setSelected} />
        </div>
      </div>
      <div className="lg:sticky lg:top-6">
        <TaskPanel task={selected} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
