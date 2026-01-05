import { getUser } from '@/src/lib/dal';
import DashboardClient from './dasboard-client';


export default async function DashboardPage() {

  const user = await getUser();
  
  return (
    <DashboardClient user={user} />
  );
}
