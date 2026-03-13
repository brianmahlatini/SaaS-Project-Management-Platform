import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { requireWorkspaceRole } from '../../../../lib/rbac';
import { Role, ActivityType, TaskStatus } from '@prisma/client';
import { logActivity } from '../../../../lib/activity';

interface RouteProps {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const task = await prisma.task.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const payload = await req.json();
  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      status: payload.status ? (payload.status as TaskStatus) : undefined,
      order: payload.order ?? undefined
    }
  });

  if (payload.status && payload.status !== task.status) {
    await prisma.taskStatusHistory.create({
      data: {
        taskId: task.id,
        from: task.status,
        to: payload.status as TaskStatus
      }
    });
  }

  await logActivity({
    workspaceId: task.project.workspaceId,
    actorId: session.user.id,
    projectId: task.projectId,
    type: ActivityType.TASK_MOVED,
    meta: { taskId: task.id, status: updated.status }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const task = await prisma.task.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN]);

  await prisma.task.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
