'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/server-utils';

interface SearchResult {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
}

export default function TaskSearch({ workspaceId }: { workspaceId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  async function handleSearch() {
    if (!query) return setResults([]);
    const data = await apiFetch<SearchResult[]>(`/api/search?workspaceId=${workspaceId}&q=${query}`);
    setResults(data);
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tasks"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
        />
        <button onClick={handleSearch} className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm text-white sm:w-auto">
          Search
        </button>
      </div>
      {results.length ? (
        <ul className="mt-4 space-y-2 text-sm text-ink-700">
          {results.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="font-semibold text-ink-900">{item.title}</div>
              <div className="text-xs text-ink-500">{item.description}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
