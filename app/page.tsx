import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-gradient min-h-screen">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex items-center justify-between">
          <div className="badge">Orbit PM</div>
          <div className="flex gap-4 text-sm font-medium text-ink-600">
            <Link href="/login">Sign in</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-ink-900 md:text-5xl">Plan, ship, and learn faster with a modern SaaS workspace.</h1>
            <p className="text-lg text-ink-600">
              A senior-level Next.js platform with workspaces, projects, Kanban, real-time comments,
              analytics, and role-based access control.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="rounded-full bg-brand-600 px-6 py-3 text-white shadow-lift">Get started</Link>
              <Link href="/dashboard" className="rounded-full border border-ink-300 px-6 py-3 text-ink-800">View demo</Link>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-sm font-semibold text-ink-500">What it proves</p>
            <ul className="mt-4 space-y-3 text-ink-700">
              <li>Next.js App Router + server components</li>
              <li>Optimistic UI with TanStack Query</li>
              <li>RBAC, activity timeline, and analytics</li>
              <li>Dockerized dev + prod workflows</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
