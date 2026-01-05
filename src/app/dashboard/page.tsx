'use client';

import { logoutAction } from '../_actions/logout.action';

export default function DashboardPage() {

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-112.5">
        Hello dashboard
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
