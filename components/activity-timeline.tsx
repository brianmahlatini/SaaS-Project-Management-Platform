import { formatDistanceToNow } from 'date-fns';

export function ActivityTimeline({ items }: { items: Array<{ id: string; type: string; createdAt: string; meta: Record<string, unknown> }> }) {
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-ink-900">Activity</h3>
      <ul className="mt-4 space-y-4 text-sm text-ink-600">
        {items.map((item) => (
          <li key={item.id}>
            <div className="font-medium text-ink-800">{item.type.replace('_', ' ')}</div>
            <div className="text-xs text-ink-500">{formatDistanceToNow(new Date(item.createdAt))} ago</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
