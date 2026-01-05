'use server';

import { deleteSession } from '@/src/lib/session';
import { redirect } from 'next/navigation';

export async function logoutAction(){
  await deleteSession();
  redirect('/login');
}