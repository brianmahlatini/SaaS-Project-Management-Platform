import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role, ActivityType } from '@prisma/client';
import { logActivity } from '../../../lib/activity';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) return NextResponse.json([], { status: 400 });

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) return NextResponse.json([], { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const attachments = await prisma.attachment.findMany({
    where: { taskId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(attachments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const taskId = payload.taskId as string;
  const url = payload.url as string;
  const filename = payload.filename as string;
  const size = payload.size as number;

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const attachment = await prisma.attachment.create({
    data: {
      taskId,
      url,
      filename,
      size
    }
  });

  await logActivity({
    workspaceId: task.project.workspaceId,
    actorId: session.user.id,
    projectId: task.projectId,
    type: ActivityType.FILE_UPLOADED,
    meta: { filename }
  });

  return NextResponse.json(attachment, { status: 201 });
}
