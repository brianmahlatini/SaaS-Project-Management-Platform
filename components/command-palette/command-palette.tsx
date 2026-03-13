'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/server-utils';

interface SearchResult {
  id: string;
  title: string;
  description?: string | null;
  status: string;
}

export default function CommandPalette({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runSearch = useCallback(async () => {
    if (!query) return setResults([]);
    const data = await apiFetch<SearchResult[]>(
      `/api/search?workspaceId=${workspaceId}&q=${query}${status ? `&status=${status}` : ''}`
    );
    setResults(data);
  }, [query, status, workspaceId]);

  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(runSearch, 250);
    return () => clearTimeout(handle);
  }, [open, runSearch]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-20">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lift dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">All</option>
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
          <button onClick={() => setOpen(false)} className="text-xs text-ink-500">
            ESC
          </button>
        </div>
        <div className="mt-4 space-y-2 text-sm text-ink-700 dark:text-slate-200">
          {results.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-ink-500">{item.status}</div>
            </div>
          ))}
          {!results.length ? <div className="text-xs text-ink-500">No results</div> : null}
        </div>
      </div>
    </div>
  );
}
