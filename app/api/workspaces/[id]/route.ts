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

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { members: true, projects: true }
  });

  return NextResponse.json(workspace);
}

export async function PATCH(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN]);
  const data = await req.json();

  const workspace = await prisma.workspace.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json(workspace);
}
