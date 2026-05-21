import { deleteSession } from '@/src/lib/session';
import { redirect } from 'next/navigation';

export async function GET() {
  await deleteSession();
  redirect('/login');
}
