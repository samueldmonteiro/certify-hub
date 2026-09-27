import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/_components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/app/_components/ui/table';
import { Button } from '@/src/app/_components/ui/button';
import { Users } from 'lucide-react';
import { CreateAttendanceCallDialog } from './_components/create-attendance-call-dialog';
import { AttendanceRowQRCode } from './_components/attendance-row-qrcode';
import { DeleteAttendanceCallButton } from './_components/delete-attendance-call-button';

export const metadata: Metadata = {
  title: 'Chamadas de Presença | Dashboard',
};

export default async function ChamadasPage() {
  const calls = await prisma.attendanceCall.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { presences: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chamadas de Presença</h1>
          <p className="text-muted-foreground mt-2">
            Crie chamadas e compartilhe o link ou QR Code para que os alunos registrem presença.
          </p>
        </div>
        <CreateAttendanceCallDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chamadas Criadas</CardTitle>
          <CardDescription>
            Lista de todas as chamadas geradas no painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhuma chamada criada ainda.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Nome da Chamada</TableHead>
                    <TableHead>Presenças</TableHead>
                    <TableHead className="w-[160px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(call.createdAt))}
                      </TableCell>
                      <TableCell className="font-medium">{call.name}</TableCell>
                      <TableCell>{call._count.presences}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/chamadas/${call.id}`}>
                            <Button variant="ghost" size="icon" title="Ver participantes">
                              <Users className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AttendanceRowQRCode callId={call.id} callName={call.name} />
                          <DeleteAttendanceCallButton id={call.id} />
                        </div>
                      </TableCell>
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
