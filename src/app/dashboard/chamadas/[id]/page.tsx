import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/_components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/app/_components/ui/table';
import { Badge } from '@/src/app/_components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';
import { AttendanceRowQRCode } from '../_components/attendance-row-qrcode';

export const metadata: Metadata = {
  title: 'Detalhes da Chamada | Dashboard',
};

interface ChamadaDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default async function ChamadaDetailPage({ params }: ChamadaDetailPageProps) {
  const { id } = await params;

  const call = await prisma.attendanceCall.findUnique({
    where: { id },
    include: {
      presences: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!call) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard/chamadas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para chamadas
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{call.name}</h1>
          <p className="text-muted-foreground mt-2">
            {call.presences.length} presença(s) registrada(s).
          </p>
        </div>
        <AttendanceRowQRCode callId={call.id} callName={call.name} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
          <CardDescription>
            Lista de alunos que registraram presença através do link desta chamada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {call.presences.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhuma presença registrada ainda.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registrado em</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Filial</TableHead>
                    <TableHead>Treinamento</TableHead>
                    <TableHead>Data do Treinamento</TableHead>
                    <TableHead>Local</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {call.presences.map((presence) => (
                    <TableRow key={presence.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(presence.createdAt))}
                      </TableCell>
                      <TableCell className="font-medium">{presence.studentName}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCPF(presence.cpf)}</TableCell>
                      <TableCell>{presence.branchNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CertificateTypeLabels[presence.course] ?? presence.course}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(presence.trainingDate))}
                      </TableCell>
                      <TableCell>{presence.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
