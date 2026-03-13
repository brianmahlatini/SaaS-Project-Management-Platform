import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { requireWorkspaceRole } from '../../../../../lib/rbac';
import { Role } from '@prisma/client';

interface PageProps {
  params: { workspaceId: string };
}

export default async function AuditPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? '';
  await requireWorkspaceRole(userId, params.workspaceId, [Role.ADMIN]);

  const activity = await prisma.activity.findMany({
    where: { workspaceId: params.workspaceId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-slate-50">Audit Log</h1>
        <p className="text-sm text-ink-600 dark:text-slate-300">Admin-only activity and security events.</p>
      </div>
      <div className="card p-6">
        <div className="space-y-3 text-sm text-ink-700 dark:text-slate-200">
          {activity.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-b-0">
              <div>
                <div className="font-semibold">{item.type}</div>
                <div className="text-xs text-ink-500">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-ink-500">{item.actorId ?? 'System'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
