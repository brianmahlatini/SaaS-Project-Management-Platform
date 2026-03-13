'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/server-utils';
import { useRouter } from 'next/navigation';

export default function CreateWorkspaceForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await apiFetch('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify({
        name: String(formData.get('name')),
        slug: String(formData.get('slug'))
      })
    });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">
        New workspace
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input name="name" placeholder="Workspace name" className="rounded-xl border border-slate-200 px-3 py-2" />
      <input name="slug" placeholder="Slug" className="rounded-xl border border-slate-200 px-3 py-2" />
      <button className="rounded-full bg-brand-600 px-3 py-2 text-sm text-white">Create</button>
      <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-600">
        Cancel
      </button>
    </form>
  );
}
