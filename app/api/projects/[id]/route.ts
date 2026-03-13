import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { requireWorkspaceRole } from '../../../../lib/rbac';
import { Role } from '@prisma/client';

interface RouteProps {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, project.workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const data = await req.json();
  const updated = await prisma.project.update({ where: { id: params.id }, data });

  return NextResponse.json(updated);
}
