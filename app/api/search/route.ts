import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role } from '@prisma/client';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get('workspaceId');
  const q = searchParams.get('q');
  const status = searchParams.get('status');

  if (!workspaceId || !q) return NextResponse.json([]);

  await requireWorkspaceRole(session.user.id, workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const results = await prisma.task.findMany({
    where: {
      project: { workspaceId },
      OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }],
      ...(status ? { status: status as any } : {})
    },
    take: 20
  });

  return NextResponse.json(results);
}
