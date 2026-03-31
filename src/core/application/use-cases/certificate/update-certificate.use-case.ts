import { ICertificateRepository } from '../../../domain/repositories/certificate.repository';
import { DomainError } from '../../../domain/errors/domain.error';
import { Certificate } from '../../../domain/entities/certificate.entity';
import { CPF } from '../../../domain/value-objects/cpf.value-object';

export interface UpdateCertificateRequest {
  id: string;
  studentName?: string;
  courseName?: string;
  cpf?: string;
  workload?: number;
  completionDate?: Date;
  message?: string;
}

export interface UpdateCertificateResponse {
  certificate: Certificate;
}

export class UpdateCertificateUseCase {
  constructor(private certificateRepo: ICertificateRepository) {}

  async execute(request: UpdateCertificateRequest): Promise<UpdateCertificateResponse> {
    const certificate = await this.certificateRepo.findById(request.id);

    if (!certificate) {
      throw new DomainError('Certificate not found');
    }

    if (request.studentName) {
      certificate.changeStudentName(request.studentName);
    }
    if (request.courseName) {
      certificate.changeCourseName(request.courseName);
    }
    if (request.cpf) {
      certificate.changeCpf(new CPF(request.cpf));
    }
    if (request.workload !== undefined) {
      certificate.changeWorkload(request.workload);
    }
    if (request.completionDate) {
      certificate.changeCompletionDate(request.completionDate);
    }
    if (request.message !== undefined) {
      certificate.changeMessage(request.message);
    }

    const updatedCertificate = await this.certificateRepo.update(certificate);

    return { certificate: updatedCertificate };
  }
}
