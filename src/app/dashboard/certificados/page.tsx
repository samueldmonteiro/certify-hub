'use client';

import { useActionState, useEffect, useState, startTransition } from 'react';
import { Search, FileText, Download, ChevronLeft, ChevronRight, Trash2, MoreVertical, X } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/app/_components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/app/_components/ui/alert-dialog';
import { Checkbox } from '@/src/app/_components/ui/checkbox';
import { searchCertificatesAction } from '../../_actions/search-certificates.action';
import { deleteCertificateAction, deleteManyCertificatesAction } from '../../_actions/certificate/delete-certificate.action';

export default function CertificatesPage() {
  const [filters, setFilters] = useState({
    studentName: '',
    cpf: '',
    courseName: '',
    page: 1,
    perPage: 10,
  });

  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSingleModalOpen, setDeleteSingleModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked && state.data) {
      setSelectedCertificates(state.data.items.map((cert: any) => cert.id));
    } else {
      setSelectedCertificates([]);
    }
  };

  const handleSelectCertificate = (certificateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCertificates([...selectedCertificates, certificateId]);
    } else {
      setSelectedCertificates(selectedCertificates.filter(id => id !== certificateId));
    }
  };

  const handleDeleteMultiple = async () => {
    setDeleteLoading(true);

    const { success } = await deleteManyCertificatesAction(selectedCertificates);

    if (success) {
      setDeleteMessage({
        type: 'success',
        text: `${selectedCertificates.length} certificado(s) deletado(s) com sucesso!`,
      });
      setSelectedCertificates([]);

      startTransition(() => {
        formAction(filters);
      });
    } else {
      setDeleteMessage({
        type: 'error',
        text: 'Erro ao deletar certificados. Tente novamente.',
      });
    }

    setDeleteLoading(false);
    setDeleteModalOpen(false);
  };

  const handleDeleteSingle = async () => {
    if (!certificateToDelete) return;

    setDeleteLoading(true);

    const { success } = await deleteCertificateAction(certificateToDelete);

    if (success) {
      setDeleteMessage({
        type: 'success',
        text: 'Certificado deletado com sucesso!',
      });

      startTransition(() => {
        formAction(filters);
      });
    } else {
      setDeleteMessage({
        type: 'error',
        text: 'Erro ao deletar certificado. Tente novamente.',
      });
    }

    setDeleteLoading(false);
    setDeleteSingleModalOpen(false);
    setCertificateToDelete(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const totalPages = state.data ? Math.ceil(state.data.total / state.data.perPage) : 0;
  const allSelected = state.data && selectedCertificates.length === state.data.items.length && state.data.items.length > 0;

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
          <div className="space-y-4 mb-6">
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
              <Button onClick={handleSearch} disabled={isPending}>
                <Search className="w-4 h-4 mr-2" />
                {isPending ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
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
          </div>

          {deleteMessage && (
            <div className={`${deleteMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'} border px-4 py-3 rounded mb-4 flex items-center justify-between`}>
              <span>{deleteMessage.text}</span>
              <button
                onClick={() => setDeleteMessage(null)}
                className="text-current hover:opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!state.success && state.message && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              {state.message}
            </div>
          )}

          {selectedCertificates.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded mb-4 flex items-center justify-between">
              <span className="text-blue-800 text-sm font-medium">
                {selectedCertificates.length} certificado(s) selecionado(s)
              </span>
              <Button
                className='text-white bg-red-500 hover:bg-red-600'
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Selecionados
              </Button>
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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
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
                    {state.data.items.map((certificate: any) => (
                      <TableRow key={certificate.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCertificates.includes(certificate.id)}
                            onCheckedChange={(checked: boolean) =>
                              handleSelectCertificate(certificate.id, checked as boolean)
                            }
                          />
                        </TableCell>
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
                          <div className="flex items-center justify-end gap-2">
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
                              <span className="text-sm text-gray-400 flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Indisponível
                              </span>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => {
                                    setCertificateToDelete(certificate.id);
                                    setDeleteSingleModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Deletar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
                      let pageNum: number;
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

      {/* Modal de confirmação para deletar múltiplos */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar {selectedCertificates.length} certificado(s).
              Esta ação não pode ser desfeita. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMultiple}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmação para deletar um único certificado */}
      <AlertDialog open={deleteSingleModalOpen} onOpenChange={setDeleteSingleModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar este certificado.
              Esta ação não pode ser desfeita. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
//485