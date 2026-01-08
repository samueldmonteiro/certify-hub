import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { StorageFileCertificate } from '@/src/core/domain/services/storage-file-certificate';

export interface SaveCertificateFileUseCaseResponse {
  fileURL: string
}

export class SaveCertificateFileUseCase {
  constructor(
    private fileGenerator: FileCertificateGenerator,
    private storageFile: StorageFileCertificate,
  ) { }

  async execute(certificate: Certificate): Promise<SaveCertificateFileUseCaseResponse> {

    const buffer = await this.fileGenerator.generate(certificate);
    const fileURL = await this.storageFile.storage(buffer);

    return {
      fileURL,
    };
  }
}