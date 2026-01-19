import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';

export class DeleteCertificateUseCase {
  constructor(
    private readonly certificateRepository: ICertificateRepository,
  ) { }

  async execute(id: string): Promise<void> {
    await this.certificateRepository.delete(id);
  }
}