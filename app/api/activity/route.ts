import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { requireWorkspaceRole } from '../../../lib/rbac';
import type { Role } from '@prisma/client';

const ALLOWED_ROLES: Role[] = ['ADMIN', 'MEMBER', 'VIEWER'];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get('workspaceId');
  const type = searchParams.get('type');

  if (!workspaceId) return NextResponse.json([], { status: 400 });

  await requireWorkspaceRole(session.user.id, workspaceId, ALLOWED_ROLES);

  const activity = await prisma.activity.findMany({
    where: {
      workspaceId,
      ...(type ? { type: type as any } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return NextResponse.json(activity);
}
