import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { StatCard } from '../../../components/stat-card';

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${i * 30},${40 - (v / max) * 30}`).join(' ');
  return (
    <svg viewBox="0 0 150 40" className="h-10 w-full">
      <polyline fill="none" stroke="#7e3ff2" strokeWidth="3" points={points} />
    </svg>
  );
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true }
  });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [tasksByStatus, activity, completed] = await Promise.all([
    prisma.task.groupBy({
      by: ['status'],
      where: { project: { workspaceId: { in: workspaceIds } } },
      _count: true
    }),
    prisma.activity.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { createdAt: 'asc' },
      take: 14
    }),
    prisma.task.count({
      where: { project: { workspaceId: { in: workspaceIds } }, status: 'DONE' }
    })
  ]);

  const sparkValues = activity.reduce<number[]>((acc) => {
    acc.push(acc.length ? acc[acc.length - 1] + 1 : 1);
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-slate-50">Analytics</h1>
        <p className="text-sm text-ink-600 dark:text-slate-300">Velocity, workload, and flow health.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Completed tasks" value={completed} trend="Last 30 days" />
        <StatCard label="Active workspaces" value={workspaceIds.length} trend="Across portfolio" />
        <StatCard label="Task statuses" value={tasksByStatus.length} trend="Current distribution" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-base font-semibold text-ink-900 dark:text-slate-50">Activity trend</h3>
          <Sparkline values={sparkValues.length ? sparkValues : [1, 2, 1, 3, 4]} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-semibold text-ink-900 dark:text-slate-50">Tasks by status</h3>
          <div className="mt-4 space-y-2 text-sm text-ink-600 dark:text-slate-300">
            {tasksByStatus.map((row) => (
              <div key={row.status} className="flex items-center justify-between">
                <span>{row.status}</span>
                <span className="font-semibold text-ink-900 dark:text-slate-50">{row._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
