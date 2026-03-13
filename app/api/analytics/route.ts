import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id }
  });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [projects, tasks, comments] = await Promise.all([
    prisma.project.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.task.count({ where: { project: { workspaceId: { in: workspaceIds } } } }),
    prisma.taskComment.count({ where: { task: { project: { workspaceId: { in: workspaceIds } } } } })
  ]);

  return NextResponse.json({ projects, tasks, comments });
}
