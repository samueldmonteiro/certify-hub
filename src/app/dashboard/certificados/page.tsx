'use client';

import { useActionState, useEffect, useState, startTransition } from 'react';
import { Search, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { CertificateViewModel } from '@/src/core/application/view-models/certificate.view-model';
import { Input } from '@/src/app/_components/ui/input';
import { Button } from '@/src/app/_components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/app/_components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/app/_components/ui/card';
import { searchCertificatesAction } from '../../_actions/search-certificates.action';

export default function CertificatesPage() {
  const [filters, setFilters] = useState({
    studentName: '',
    cpf: '',
    courseName: '',
    page: 1,
    perPage: 10,
  });

  const [state, formAction, isPending] = useActionState(searchCertificatesAction, {
    success: false,
    message: '',
    data: undefined,
  });

  useEffect(() => {
    const formData = new FormData();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) formData.append(key, value.toString());
    });
    startTransition(() => {
      formAction(filters);
    });
  }, [filters, filters.page, formAction]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    const formData = new FormData();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) formData.append(key, value.toString());
    });
    startTransition(() => {
      formAction(filters);
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const totalPages = state.data ? Math.ceil(state.data.total / state.data.perPage) : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Certificados</CardTitle>
          <CardDescription>
            Gerencie e visualize todos os certificados emitidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="studentName" className="text-sm font-medium">
                  Nome do Aluno
                </label>
                <Input
                  id="studentName"
                  placeholder="Digite o nome do aluno"
                  value={filters.studentName}
                  onChange={(e) => handleFilterChange('studentName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cpf" className="text-sm font-medium">
                  CPF
                </label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={filters.cpf}
                  onChange={(e) => handleFilterChange('cpf', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="courseName" className="text-sm font-medium">
                  Nome do Curso
                </label>
                <Input
                  id="courseName"
                  placeholder="Digite o nome do curso"
                  value={filters.courseName}
                  onChange={(e) => handleFilterChange('courseName', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                <Search className="w-4 h-4 mr-2" />
                {isPending ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFilters({
                    studentName: '',
                    cpf: '',
                    courseName: '',
                    page: 1,
                    perPage: 10,
                  });
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </form>

          {!state.success && state.message && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              {state.message}
            </div>
          )}

          {state.data && state.data.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum certificado encontrado
            </div>
          )}

          {state.data && state.data.items.length > 0 && (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Carga Horária</TableHead>
                      <TableHead>Conclusão</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.data.items.map((certificate: CertificateViewModel) => (
                      <TableRow key={certificate.id}>
                        <TableCell className="font-medium">
                          {certificate.studentName}
                        </TableCell>
                        <TableCell>{formatCPF(certificate.cpf)}</TableCell>
                        <TableCell>{certificate.courseName}</TableCell>
                        <TableCell>{certificate.workload}h</TableCell>
                        <TableCell>{formatDate(certificate.completionDate)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {certificate.registrationNumber}
                        </TableCell>
                        <TableCell className="text-right">
                          {certificate.fileURL ? (
                            <a
                              href={certificate.fileURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                              <span className="text-sm">Download</span>
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400 flex items-center justify-end gap-1">
                              <FileText className="w-4 h-4" />
                              Indisponível
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Mostrando {(state.data.page - 1) * state.data.perPage + 1} a{' '}
                  {Math.min(state.data.page * state.data.perPage, state.data.total)} de{' '}
                  {state.data.total} certificados
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(state.data!.page - 1)}
                    disabled={state.data.page === 1 || isPending}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (state.data!.page <= 3) {
                        pageNum = i + 1;
                      } else if (state.data!.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = state.data!.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={state.data!.page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isPending}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(state.data!.page + 1)}
                    disabled={state.data.page >= totalPages || isPending}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}