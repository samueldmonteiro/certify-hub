import { Certificate } from '../entities/certificate.entity';
import { DomainError } from '../errors/domain.error';
import { ResourceNotFoundError } from '../errors/resource-not-found.error';
import { IMakeCertificatePdfProvider } from '../providers/make-certificate-pdf/make-certificate-pdf.provider';
import { CertificateSearchParams, ICertificateRepository, PaginatedResult } from '../repositories/certificate.repository';
import { CertificateType } from '../enums/certificate-type.enum';
import { CertificatePage } from '../value-objects/certificate-page.value-object';
import { CPF } from '../value-objects/cpf.value-object';
import { PTSBook } from '../value-objects/pts-book.value-object';
import { RegistrationNumber } from '../value-objects/registration-number.value-object';

export interface UpdateCertificateRequest {
  id: string;
  studentName?: string;
  courseName?: string;
  cpf?: string;
  workload?: number;
  completionDate?: Date;
  registrationNumber?: string;
  page?: string
  ptsBook?: string
  type?: CertificateType
}

export class CertificateService {
  constructor(
    private readonly certificateRepository: ICertificateRepository,
    private readonly makeCertificatePdfProvider: IMakeCertificatePdfProvider,
  ) { }

  async delete(id: string): Promise<void> {
    await this.certificateRepository.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.certificateRepository.deleteMany(ids);
  }


  async update(request: UpdateCertificateRequest): Promise<{ certificate: Certificate }> {
    const certificate = await this.certificateRepository.findById(request.id);

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

    if (request.registrationNumber) {
      certificate.changeRegistrationNumber(new RegistrationNumber(request.registrationNumber));
    }
    if (request.page) {
      certificate.changePage(new CertificatePage(request.page));
    }
    if (request.ptsBook) {
      certificate.changePtsBook(new PTSBook(request.ptsBook));
    }
    if (request.type) {
      certificate.changeType(request.type);
    }

    const updatedCertificate = await this.certificateRepository.update(certificate);

    return { certificate: updatedCertificate };
  }

  async search(params: CertificateSearchParams): Promise<PaginatedResult<Certificate>> {
    const search = await this.certificateRepository.search(params);
    return search;
  }

  async generatePdf(certificateId: string):
    Promise<{ buffer: Buffer, filename: string }> {
    const certificate = await this.certificateRepository.findById(certificateId);

    if (!certificate) {
      throw new ResourceNotFoundError('Certificado não encontrado');
    }

    const buffer = await this.makeCertificatePdfProvider.generatePDF(certificate);

    const safeName = certificate.studentName.replace(/\s+/g, '_').toLowerCase();
    const filename = `certificado_${safeName}.pdf`;

    return { buffer, filename };
  }

  async generateManyPdf(certificateIds: string[]):
    Promise<Array<{ buffer: Buffer, filename: string }>> {
    const results: Array<{ buffer: Buffer, filename: string }> = [];

    const seen = new Map<string, number>();

    for (const id of certificateIds) {
      const certificate = await this.certificateRepository.findById(id);

      if (!certificate) {
        throw new ResourceNotFoundError(`Certificado ${id} não encontrado`);
      }

      const buffer = await this.makeCertificatePdfProvider.generatePDF(certificate);

      const safeName = certificate.studentName.replace(/\s+/g, '_').toLowerCase();
      const baseFilename = `certificado_${safeName}`;

      // Avoid duplicate filenames in the same ZIP
      const count = seen.get(baseFilename) ?? 0;
      seen.set(baseFilename, count + 1);
      const filename = count === 0 ? `${baseFilename}.pdf` : `${baseFilename}_${count + 1}.pdf`;

      results.push({ buffer, filename });
    }

    return results;
  }
}