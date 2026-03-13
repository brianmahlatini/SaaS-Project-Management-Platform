import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { commentSchema } from '../../../lib/validators';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role, ActivityType } from '@prisma/client';
import { logActivity } from '../../../lib/activity';
import { publish } from '../../../lib/events';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) return NextResponse.json([], { status: 400 });

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) return NextResponse.json([], { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const comments = await prisma.taskComment.findMany({
    where: { taskId },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = commentSchema.parse(await req.json());
  const task = await prisma.task.findUnique({ where: { id: payload.taskId }, include: { project: true } });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const comment = await prisma.taskComment.create({
    data: {
      content: payload.content,
      taskId: payload.taskId,
      authorId: session.user.id
    },
    include: { author: true }
  });

  await logActivity({
    workspaceId: task.project.workspaceId,
    actorId: session.user.id,
    projectId: task.projectId,
    type: ActivityType.COMMENT_ADDED,
    meta: { taskId: task.id }
  });

  publish(`task:${payload.taskId}`, JSON.stringify(comment));

  return NextResponse.json(comment, { status: 201 });
}
