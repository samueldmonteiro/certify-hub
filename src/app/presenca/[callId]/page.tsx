import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { AttendanceForm } from './_components/attendance-form';
import Image from 'next/image';
import logo from '@/src/app/assets/logo_whitout_title.png';

export const metadata: Metadata = {
  title: 'Lista de Presença | Certify Hub',
  description: 'Registre sua presença no treinamento.',
};

interface PresencaPageProps {
  params: Promise<{ callId: string }>;
}

export default async function PresencaPage({ params }: PresencaPageProps) {
  const { callId } = await params;

  const call = await prisma.attendanceCall.findUnique({
    where: { id: callId },
  });

  if (!call) {
    notFound();
  }

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
          Lista de presença: {call.name}
        </p>
      </div>

      <div className="w-full max-w-xl">
        <AttendanceForm callId={call.id} />
      </div>
    </div>
  );
}
