import { prisma } from './prisma';

export async function createNotification(params: { userId: string; title: string; body?: string }) {
  return prisma.notification.create({ data: params });
}
