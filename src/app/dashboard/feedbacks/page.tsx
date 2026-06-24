import { Metadata } from 'next';
import { prisma } from '@/src/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/_components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/app/_components/ui/table';
import { Badge } from '@/src/app/_components/ui/badge';
import { Button } from '@/src/app/_components/ui/button';
import { Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Feedbacks | Dashboard',
};

export default async function FeedbacksPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedbacks dos Alunos</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie os feedbacks deixados pelos alunos nos cursos.
          </p>
        </div>
        <Link href="/avaliar" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Acessar Formulário Público
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Feedbacks</CardTitle>
          <CardDescription>
            Lista de todos os feedbacks recebidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum feedback recebido ainda.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Mensagem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback: any) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(feedback.createdAt))}
                      </TableCell>
                      <TableCell className="font-medium">{feedback.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.course}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.stars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate" title={feedback.message}>
                        {feedback.message}
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
