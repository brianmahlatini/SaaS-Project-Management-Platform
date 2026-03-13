import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import CreateWorkspaceForm from '../../../components/create-workspace-form';
import Link from 'next/link';

export default async function WorkspacesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900">Workspaces</h1>
        <CreateWorkspaceForm />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {memberships.map((membership) => (
          <Link key={membership.workspace.id} href={`/workspaces/${membership.workspace.id}`} className="card p-6">
            <div className="text-lg font-semibold text-ink-900">{membership.workspace.name}</div>
            <div className="text-sm text-ink-600">Role: {membership.role}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
