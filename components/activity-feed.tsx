'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/server-utils';

interface ActivityItem {
  id: string;
  type: string;
  createdAt: string;
}

export default function ActivityFeed({ workspaceId }: { workspaceId: string }) {
  const { data = [] } = useQuery({
    queryKey: ['activity', workspaceId],
    queryFn: () => apiFetch<ActivityItem[]>(`/api/activity?workspaceId=${workspaceId}`)
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Activity Feed</h3>
        <a href={`/workspaces/${workspaceId}/audit`} className="text-xs text-brand-600">Audit log</a>
      </div>
      <div className="mt-4 space-y-3 text-sm text-ink-700 dark:text-slate-200">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span>{item.type}</span>
            <span className="text-xs text-ink-500">{new Date(item.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
