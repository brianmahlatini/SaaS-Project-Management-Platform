import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { Role } from '@prisma/client';
import { createNotification } from '../../../lib/notifications';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const invite = await prisma.workspaceInvite.findUnique({ where: { id: payload.inviteId } });
  if (!invite) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.workspaceMember.create({
    data: {
      userId: session.user.id,
      workspaceId: invite.workspaceId,
      role: invite.role ?? Role.MEMBER
    }
  });

  await prisma.workspaceInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() }
  });

  await createNotification({
    userId: session.user.id,
    title: 'Workspace access granted',
    body: `You joined ${invite.workspaceId}`
  });

  return NextResponse.json({ ok: true });
}
