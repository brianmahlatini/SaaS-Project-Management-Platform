import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { requireWorkspaceRole } from '../../../../../lib/rbac';
import { Role, ActivityType } from '@prisma/client';
import { logActivity } from '../../../../../lib/activity';

interface RouteProps {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: params.id },
    include: { user: true }
  });

  return NextResponse.json(members);
}

export async function PATCH(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN]);
  const payload = await req.json();

  const updated = await prisma.workspaceMember.update({
    where: { id: payload.memberId },
    data: { role: payload.role as Role }
  });

  await logActivity({
    workspaceId: params.id,
    actorId: session.user.id,
    type: ActivityType.MEMBER_ROLE_UPDATED,
    meta: { memberId: updated.id, role: updated.role }
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN]);
  const payload = await req.json();

  await prisma.workspaceMember.delete({ where: { id: payload.memberId } });

  await logActivity({
    workspaceId: params.id,
    actorId: session.user.id,
    type: ActivityType.MEMBER_REMOVED,
    meta: { memberId: payload.memberId }
  });

  return NextResponse.json({ ok: true });
}
