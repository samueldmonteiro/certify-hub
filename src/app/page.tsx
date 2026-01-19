import { redirect } from 'next/navigation';
import { verifySession } from '../lib/dal';

export default async function Home() {

  const verify = await verifySession();

  if (!verify.isAuth) {
    return redirect('/login');
  }

  return redirect('/dashboard');
}
