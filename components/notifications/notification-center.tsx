'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { apiFetch } from '../../lib/server-utils';

interface NotificationItem {
  id: string;
  title: string;
  body?: string | null;
  createdAt: string;
  readAt?: string | null;
}

export default function NotificationCenter() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<NotificationItem[]>('/api/notifications')
  });

  const visible = useMemo(() => {
    if (filter === 'unread') return data.filter((note) => !note.readAt);
    return data;
  }, [data, filter]);

  const unreadCount = data.filter((note) => !note.readAt).length;

  const markRead = useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch('/api/notifications/read', {
        method: 'POST',
        body: JSON.stringify({ ids })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Inbox</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            className={`rounded-full border px-3 py-1 ${
              filter === 'all' ? 'border-ink-300 text-ink-900' : 'border-slate-200 text-ink-500'
            } dark:border-slate-700`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`rounded-full border px-3 py-1 ${
              filter === 'unread' ? 'border-ink-300 text-ink-900' : 'border-slate-200 text-ink-500'
            } dark:border-slate-700`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700"
            onClick={() => markRead.mutate(data.filter((n) => !n.readAt).map((n) => n.id))}
          >
            Mark all read
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm text-ink-700 dark:text-slate-200">
        {visible.map((note) => (
          <div key={note.id} className={`rounded-xl border p-3 ${note.readAt ? 'border-slate-100' : 'border-brand-300'}`}>
            <div className="font-semibold">{note.title}</div>
            <div className="text-xs text-ink-500">{note.body}</div>
          </div>
        ))}
        {!visible.length ? <div className="text-xs text-ink-500">No notifications yet.</div> : null}
      </div>
    </div>
  );
}
