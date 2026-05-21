'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/_components/ui/card';
import { Checkbox } from '@/src/app/_components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/app/_components/ui/table';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { formatDateToPTBR } from '@/src/lib/utils';

interface StudentTableProps {
  students: RegisterCertificateRequest[];
  selectedStudents: RegisterCertificateRequest[];
  onSelectionChange: (selected: RegisterCertificateRequest[]) => void;
}

export default function StudentTable({
  students,
  selectedStudents,
  onSelectionChange,
}: StudentTableProps) {
  // Criar um identificador único para cada aluno (nome + CPF)
  const getStudentId = (student: RegisterCertificateRequest) => {
    return `${student.studentName}-${student.cpf}`;
  };

  // Verificar se um aluno específico está selecionado
  const isStudentSelected = (student: RegisterCertificateRequest) => {
    return selectedStudents.some(
      selected => getStudentId(selected) === getStudentId(student),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange([...students]);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (student: RegisterCertificateRequest, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedStudents, student]);
    } else {
      onSelectionChange(
        selectedStudents.filter(
          selected => getStudentId(selected) !== getStudentId(student),
        ),
      );
    }
  };

  const isAllSelected = students.length > 0 && selectedStudents.length === students.length;
  const isSomeSelected = selectedStudents.length > 0 && selectedStudents.length < students.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos Importados ({students.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    className={isSomeSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Data de Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={getStudentId(student)}>
                  <TableCell>
                    <Checkbox
                      checked={isStudentSelected(student)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(student, checked as boolean)
                      }
                      aria-label={`Selecionar ${student.studentName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>{student.cpf}</TableCell>
                  <TableCell>{formatDateToPTBR(student.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}