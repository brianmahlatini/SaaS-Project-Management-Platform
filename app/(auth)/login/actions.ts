'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';

export async function registerUser(payload: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) return { ok: false, message: 'Email already registered.' };

  const password = await bcrypt.hash(payload.password, 10);
  await prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      password
    }
  });

  return { ok: true };
}
