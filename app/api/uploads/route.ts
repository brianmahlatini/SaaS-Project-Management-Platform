import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { requireWorkspaceRole } from '../../../lib/rbac';
import { Role, ActivityType } from '@prisma/client';
import { logActivity } from '../../../lib/activity';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const taskId = form.get('taskId') as string | null;

  if (!file || !taskId) return NextResponse.json({ error: 'Missing file or taskId' }, { status: 400 });

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await requireWorkspaceRole(session.user.id, task.project.workspaceId, [Role.ADMIN, Role.MEMBER]);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`.replace(/\s+/g, '-');
  const path = `public/uploads/${filename}`;

  await import('node:fs/promises').then((fs) => fs.mkdir('public/uploads', { recursive: true }));
  await import('node:fs/promises').then((fs) => fs.writeFile(path, buffer));

  const attachment = await prisma.attachment.create({
    data: {
      taskId,
      filename: file.name,
      url: `/uploads/${filename}`,
      size: buffer.length
    }
  });

  await logActivity({
    workspaceId: task.project.workspaceId,
    actorId: session.user.id,
    projectId: task.projectId,
    type: ActivityType.FILE_UPLOADED,
    meta: { filename: file.name }
  });

  return NextResponse.json(attachment, { status: 201 });
}
