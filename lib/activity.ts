import { prisma } from './prisma';
import { ActivityType, Prisma } from '@prisma/client';

export async function logActivity(params: {
  workspaceId: string;
  actorId?: string;
  projectId?: string;
  type: ActivityType;
  meta: Prisma.InputJsonValue;
}) {
  return prisma.activity.create({ data: params });
}
