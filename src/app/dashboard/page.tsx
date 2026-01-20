import { redirect } from 'next/navigation';

export default function DashboardPage() {

  if (true) redirect('/dashboard/certificados');
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}