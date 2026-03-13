import { prisma } from '../../../../../../lib/prisma';
import ProjectBoard from '../../../../../../components/project-board';

interface ProjectPageProps {
  params: { workspaceId: string; projectId: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { workspace: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">{project?.name}</h1>
        <p className="text-sm text-ink-600">{project?.description}</p>
      </div>
      <ProjectBoard projectId={params.projectId} workspaceId={params.workspaceId} />
    </div>
  );
}
