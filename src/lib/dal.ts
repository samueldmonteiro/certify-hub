import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/src/lib/session';
import { cache } from 'react';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';
import { UserViewModel } from '../core/application/view-models/user.view-model';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId };
});

export const getUserAuthenticated = cache(async (): Promise<UserViewModel|null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: String(session.userId) } });

    return {
      id: user.id,
      name:user.name,
      email: user.email,
    };
    
  } catch {
    console.log('Failed to fetch user');
    return null;
  }
});

