import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { StatCard } from '../../../components/stat-card';
import { ActivityTimeline } from '../../../components/activity-timeline';
import ActivityFeed from '../../../components/activity-feed';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true }
  });

  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [projects, tasks, activity] = await Promise.all([
    prisma.project.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.task.count({ where: { project: { workspaceId: { in: workspaceIds } } } }),
    prisma.activity.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { createdAt: 'desc' },
      take: 8
    })
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Workspaces" value={memberships.length} trend="Active memberships" />
        <StatCard label="Projects" value={projects} trend="Across all workspaces" />
        <StatCard label="Tasks" value={tasks} trend="Open + closed" />
      </div>
      <ActivityTimeline
        items={activity.map((item) => ({
          id: item.id,
          type: item.type,
          createdAt: item.createdAt.toISOString(),
          meta: item.meta as Record<string, unknown>
        }))}
      />
      {workspaceIds.length ? <ActivityFeed workspaceId={workspaceIds[0]} /> : null}
    </div>
  );
}
