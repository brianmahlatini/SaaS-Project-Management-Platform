'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('orbit-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('orbit-theme', next ? 'dark' : 'light');
  }

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-ink-700 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:text-slate-200"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
