import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { randomUUID } from 'node:crypto';

export interface RegisterCertificateRequest {
  studentName: string,
  courseName: string,
  cpf: string,
  workload: number,
  completionDate: Date,
  page: string,
  registrationNumber: string,
}

export interface RegisterCertificateResponse {
  certificate: Certificate
}

export class RegisterCertificateUseCase {

  constructor(
    private certificateRepo: ICertificateRepository,
  ) { }

  async execute(request: RegisterCertificateRequest): Promise<RegisterCertificateResponse> {

    // verificar se já existe certificado com o mesmo nome de aluno

    const certificate = new Certificate({
      id: randomUUID(),
      studentName: request.studentName,
      courseName: request.courseName,
      completionDate: request.completionDate,
      createdAt: new Date(),
      page: new CertificatePage(request.page),
      registrationNumber: new RegistrationNumber(request.registrationNumber),
      cpf: new CPF(request.cpf),
      ptsBook: new PTSBook('001/2026'),
      workload: request.workload,
    });

    const newCert = await this.certificateRepo.create(certificate);
    return { certificate: newCert };
  }
}