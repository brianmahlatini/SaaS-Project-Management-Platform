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

  const invites = await prisma.workspaceInvite.findMany({
    where: { workspaceId: params.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(invites);
}

export async function POST(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await requireWorkspaceRole(session.user.id, params.id, [Role.ADMIN]);
  const payload = await req.json();

  const invite = await prisma.workspaceInvite.create({
    data: {
      email: payload.email,
      role: payload.role as Role,
      workspaceId: params.id,
      senderId: session.user.id
    }
  });

  await logActivity({
    workspaceId: params.id,
    actorId: session.user.id,
    type: ActivityType.MEMBER_INVITED,
    meta: { email: invite.email, role: invite.role }
  });

  return NextResponse.json(invite, { status: 201 });
}
