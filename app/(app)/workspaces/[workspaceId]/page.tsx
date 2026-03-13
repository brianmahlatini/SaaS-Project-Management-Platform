import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import CreateProjectForm from '../../../../components/create-project-form';
import Link from 'next/link';
import TaskSearch from '../../../../components/task-search';
import TeamManager from '../../../../components/team-manager';
import CommandPalette from '../../../../components/command-palette/command-palette';

interface WorkspacePageProps {
  params: { workspaceId: string };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: userId ?? '', workspaceId: params.workspaceId } },
    include: { workspace: true }
  });

  const projects = await prisma.project.findMany({
    where: { workspaceId: params.workspaceId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">{membership?.workspace.name}</h1>
          <p className="text-sm text-ink-600">Role: {membership?.role}</p>
        </div>
        <CreateProjectForm workspaceId={params.workspaceId} />
      </div>
      <CommandPalette workspaceId={params.workspaceId} />
      <TaskSearch workspaceId={params.workspaceId} />
      <TeamManager workspaceId={params.workspaceId} />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/workspaces/${params.workspaceId}/projects/${project.id}`}
            className="card p-6"
          >
            <div className="text-lg font-semibold text-ink-900">{project.name}</div>
            <div className="text-sm text-ink-600">{project.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
