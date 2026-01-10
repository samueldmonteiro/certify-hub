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
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { formatDateToPTBR } from '@/src/lib/utils';

interface StudentTableProps {
  students: CertificateDraft[];
  selectedStudents: string[];
  onSelectionChange: (selected: string[]) => void;
}

export default function StudentTable({
  students,
  selectedStudents,
  onSelectionChange,
}: StudentTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(students.map(s => s.studentName));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedStudents, id]);
    } else {
      onSelectionChange(selectedStudents.filter(sid => sid !== id));
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
                <TableRow key={student.studentName}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.includes(student.studentName)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(student.studentName, checked as boolean)
                      }
                      aria-label={`Selecionar ${student.studentName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>{student.cpf.getValue()}</TableCell>
                  <TableCell>{formatDateToPTBR(student.completionDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}