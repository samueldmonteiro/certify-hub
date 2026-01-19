import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';

export class DeleteManyCertificatesUseCase {
  constructor(
    private readonly certificateRepository: ICertificateRepository,
  ) { }

  async execute(ids: string[]): Promise<void> {
    await this.certificateRepository.deleteMany(ids);
  }
}