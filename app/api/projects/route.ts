import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { projectSchema } from '../../../lib/validators';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role, ActivityType } from '@prisma/client';
import { logActivity } from '../../../lib/activity';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get('workspaceId');

  if (!workspaceId) return NextResponse.json([], { status: 400 });

  await requireWorkspaceRole(session.user.id, workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const projects = await prisma.project.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = projectSchema.parse(await req.json());
  await requireWorkspaceRole(session.user.id, payload.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      workspaceId: payload.workspaceId
    }
  });

  await logActivity({
    workspaceId: payload.workspaceId,
    actorId: session.user.id,
    projectId: project.id,
    type: ActivityType.PROJECT_CREATED,
    meta: { name: project.name }
  });

  return NextResponse.json(project, { status: 201 });
}
