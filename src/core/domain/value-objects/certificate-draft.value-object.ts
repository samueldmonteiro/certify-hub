import { CPF } from './cpf.value-object';

export interface CertificateDraft {
  studentName: string;
  cpf: CPF;
  completionDate: Date;
  courseName: string;
  workload: number;
}
