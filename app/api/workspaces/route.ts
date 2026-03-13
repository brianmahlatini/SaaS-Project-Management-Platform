import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { workspaceSchema } from '../../../lib/validators';
import { logActivity } from '../../../lib/activity';
import { Role, ActivityType } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: { workspace: true }
  });

  return NextResponse.json(memberships);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = workspaceSchema.parse(await req.json());

  const workspace = await prisma.workspace.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: Role.ADMIN
        }
      }
    }
  });

  await logActivity({
    workspaceId: workspace.id,
    actorId: session.user.id,
    type: ActivityType.WORKSPACE_CREATED,
    meta: { name: workspace.name }
  });

  return NextResponse.json(workspace, { status: 201 });
}
