'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from './theme-toggle';

interface AppShellProps {
  user?: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}

export default function AppShell({ user, children }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="badge">Orbit PM</div>
            <nav className="hidden gap-4 text-sm font-medium text-ink-600 dark:text-slate-300 md:flex">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/workspaces">Workspaces</Link>
              <Link href="/inbox">Inbox</Link>
              <Link href="/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-600 dark:text-slate-200">
            <ThemeToggle />
            <div className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700 md:block">
              {user?.name ?? user?.email}
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs md:hidden dark:border-slate-700"
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {open ? (
          <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900 md:hidden">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/analytics" onClick={() => setOpen(false)}>
              Analytics
            </Link>
            <Link href="/workspaces" onClick={() => setOpen(false)}>
              Workspaces
            </Link>
            <Link href="/inbox" onClick={() => setOpen(false)}>
              Inbox
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)}>
              Settings
            </Link>
          </div>
        ) : null}
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
