import { LoginForm } from '@/src/app/_components/login-form';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-112.5">
        <LoginForm />
      </div>
    </div>
  );
}
