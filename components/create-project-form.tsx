'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/server-utils';
import { useRouter } from 'next/navigation';

export default function CreateProjectForm({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await apiFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: String(formData.get('name')),
        description: String(formData.get('description')),
        workspaceId
      })
    });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">
        New project
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input name="name" placeholder="Project name" className="rounded-xl border border-slate-200 px-3 py-2" />
      <input name="description" placeholder="Description" className="rounded-xl border border-slate-200 px-3 py-2" />
      <button className="rounded-full bg-brand-600 px-3 py-2 text-sm text-white">Create</button>
      <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-600">
        Cancel
      </button>
    </form>
  );
}
