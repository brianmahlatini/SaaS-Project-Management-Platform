import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { taskSchema } from '../../../lib/validators';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role, ActivityType, TaskStatus } from '@prisma/client';
import { logActivity } from '../../../lib/activity';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const cursor = searchParams.get('cursor');
  const take = Number(searchParams.get('take') ?? 200);
  if (!projectId) return NextResponse.json([], { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json([], { status: 404 });

  await requireWorkspaceRole(session.user.id, project.workspaceId, [Role.ADMIN, Role.MEMBER, Role.VIEWER]);

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { order: 'asc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = taskSchema.parse(await req.json());
  const project = await prisma.project.findUnique({ where: { id: payload.projectId } });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: (payload.status as TaskStatus) ?? TaskStatus.TODO,
      projectId: payload.projectId,
      order: payload.order ?? 0
    }
  });

  await logActivity({
    workspaceId: project.workspaceId,
    actorId: session.user.id,
    projectId: project.id,
    type: ActivityType.TASK_CREATED,
    meta: { title: task.title }
  });

  return NextResponse.json(task, { status: 201 });
}
