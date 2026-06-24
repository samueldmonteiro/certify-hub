import { Metadata } from 'next';
import { FeedbackForm } from './_components/feedback-form';
import Image from 'next/image';
import logo from '@/src/app/assets/logo_whitout_title.png';

export const metadata: Metadata = {
  title: 'Avaliar Curso | Certify Hub',
  description: 'Deixe seu feedback sobre o curso realizado.',
};

export default function FeedbackPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl flex flex-col items-center text-center mb-8">
        <div className="mb-4">
          <Image src={logo} alt="Certify Hub Logo" width={60} height={60} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Certify Hub
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deixe seu feedback sobre o curso realizado.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <FeedbackForm />
      </div>
    </div>
  );
}
