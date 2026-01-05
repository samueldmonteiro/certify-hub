import 'server-only';
 
import { cookies } from 'next/headers';
import { decrypt } from '@/src/lib/session';
import { cache } from 'react';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';
import { User } from '../core/domain/entities/user.entity';
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
 
  if (!session?.userId) {
    redirect('/login');
  }
 
  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;
 
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id : String(session.userId) } });

    return new User(user);
  } catch {
    console.log('Failed to fetch user');
    return null;
  }
});