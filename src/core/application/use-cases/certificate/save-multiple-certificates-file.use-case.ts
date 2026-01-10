import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { StorageFileCertificate } from '@/src/core/domain/services/storage-file-certificate';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';

export interface SaveMultipleCertificatesFileResponse {
  draftCertificates: CertificateDraft[]
}

export class SaveMultipleCertificatesFileUseCase {
  constructor(
    private fileGenerator: FileCertificateGenerator,
    private storageFile: StorageFileCertificate,
  ) { }

  async execute(draftCertificates: CertificateDraft[]): Promise<SaveMultipleCertificatesFileResponse> {

    const newCerts: CertificateDraft[] = [];

    for (const certData of draftCertificates) {
      const buffer = await this.fileGenerator.generate(certData);
      const fileURL = await this.storageFile.storage(buffer);
      certData.fileUrl = fileURL;
      newCerts.push(certData);
    };

    return {
      draftCertificates: newCerts,
    };
  }
}