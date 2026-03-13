import { Role } from '@prisma/client';
import { prisma } from './prisma';

export async function requireWorkspaceRole(userId: string, workspaceId: string, roles: Role[]) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } }
  });

  if (!membership || !roles.includes(membership.role)) {
    throw new Error('FORBIDDEN');
  }

  return membership;
}
