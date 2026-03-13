import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  const payload = await req.json();
  const ids = payload.ids as string[];

  await prisma.notification.updateMany({
    where: { id: { in: ids }, userId: session.user.id },
    data: { readAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
