import 'dotenv/config';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { StorageFile } from '@/src/core/domain/services/storage-file';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { randomUUID } from 'node:crypto';

export interface SaveMultipleCertificatesFileResponse {
  certificates: Certificate[]
}

export interface GenerateNextRegistrationNumberResponse {
  registrationNumber: RegistrationNumber
  page: CertificatePage
}

export class SaveMultipleCertificatesFileUseCase {
  constructor(
    private fileGenerator: FileCertificateGenerator,
    private storageFile: StorageFile,
    private certificateRepo: ICertificateRepository,
  ) { }

  generateNextRegistrationNumberAndPage(lastCertificate: Certificate): GenerateNextRegistrationNumberResponse {
    const lastRegNumber = lastCertificate.registrationNumber.getValue();
    const lastPage = lastCertificate.page.getValue();

    const lastRegNumberSplit = lastRegNumber.split('/');
    const lastPageSplit = lastPage.split('/');

    const lastRegNumberValue = lastRegNumberSplit[0];
    const lastRegNumberValueNumber = Number(lastRegNumberValue);

    const nextRegNumberValue = lastRegNumberValueNumber + 1;
    const nextPageValue = Math.ceil(nextRegNumberValue / 50);

    const nextRegNumber = `${nextRegNumberValue}/${lastRegNumberSplit[1]}`;
    const nextPage = `${nextPageValue}/${lastPageSplit[1]}`;

    return {
      registrationNumber: new RegistrationNumber(nextRegNumber),
      page: new CertificatePage(nextPage),
    };
  }

  async execute(draftCertificates: CertificateDraft[]): Promise<SaveMultipleCertificatesFileResponse> {

    const currentYear = new Date().getFullYear();

    const certificates: Certificate[] = [];

    for (const certificateDraft of draftCertificates) {

      const lastCertificate = await this.certificateRepo.lastCreated();
      let registrationNumber: RegistrationNumber;
      let page: CertificatePage;

      if (!lastCertificate) {
        registrationNumber = new RegistrationNumber('0001/' + currentYear);
        page = new CertificatePage('001/' + currentYear);
      } else {
        const generated = this.generateNextRegistrationNumberAndPage(lastCertificate);
        registrationNumber = generated.registrationNumber;
        page = generated.page;
      }

      const newCert = new Certificate({
        id: randomUUID(),
        completionDate: certificateDraft.completionDate,
        courseName: certificateDraft.courseName,
        cpf: certificateDraft.cpf,
        createdAt: new Date(),
        studentName: certificateDraft.studentName,
        workload: certificateDraft.workload,
        registrationNumber,
        page,
        ptsBook: new PTSBook('001/' + currentYear),
      });

      const buffer = await this.fileGenerator.generate(newCert, certificateDraft);

      const path = `${process.env.NODE_ENV == 'test' ? 'tests' : 'certificates'}/certificate-${randomUUID()}.pdf`;

      const fileURL = await this.storageFile.storage(buffer, path);

      newCert.changeFileURL(fileURL);

      const createdCert = await this.certificateRepo.create(newCert);
      certificates.push(createdCert);
    }

    return {
      certificates,
    };
  }
}