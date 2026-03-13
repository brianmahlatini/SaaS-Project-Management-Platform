'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/server-utils';

interface Member {
  id: string;
  role: string;
  user: { name?: string | null; email?: string | null };
}

interface Invite {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function TeamManager({ workspaceId }: { workspaceId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  const load = useCallback(async () => {
    const data = await apiFetch<Member[]>(`/api/workspaces/${workspaceId}/members`);
    const inviteData = await apiFetch<Invite[]>(`/api/workspaces/${workspaceId}/invites`);
    setMembers(data);
    setInvites(inviteData);
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  async function invite(formData: FormData) {
    await apiFetch(`/api/workspaces/${workspaceId}/invites`, {
      method: 'POST',
      body: JSON.stringify({
        email: String(formData.get('email')),
        role: String(formData.get('role'))
      })
    });
    await load();
  }

  async function updateRole(memberId: string, role: string) {
    await apiFetch(`/api/workspaces/${workspaceId}/members`, {
      method: 'PATCH',
      body: JSON.stringify({ memberId, role })
    });
    await load();
  }

  async function remove(memberId: string) {
    await apiFetch(`/api/workspaces/${workspaceId}/members`, {
      method: 'DELETE',
      body: JSON.stringify({ memberId })
    });
    await load();
  }

  return (
    <div className="card space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Team</h3>
        <form action={invite} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            name="email"
            placeholder="Invite email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 sm:w-56"
          />
          <select name="role" className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button className="rounded-full bg-brand-600 px-3 py-2 text-xs text-white">Invite</button>
        </form>
      </div>
      <div className="space-y-2 text-sm text-ink-700 dark:text-slate-200">
        {members.map((member) => (
          <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
            <div>
              <div className="font-semibold">{member.user.name ?? member.user.email}</div>
              <div className="text-xs text-ink-500">{member.user.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={member.role}
                onChange={(event) => updateRole(member.id, event.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <button onClick={() => remove(member.id)} className="rounded-full border border-ink-300 px-2 py-1 text-xs">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-ink-500">Pending invites</div>
      <div className="grid gap-2 text-xs">
        {invites.map((invite) => (
          <div key={invite.id} className="rounded-xl border border-slate-100 p-2">
            {invite.email} — {invite.role}
          </div>
        ))}
      </div>
    </div>
  );
}
