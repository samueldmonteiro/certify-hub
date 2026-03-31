import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { DeleteCertificateUseCase } from './delete-certificate.use-case';
import { describe, it, expect, vi, Mocked, beforeEach } from 'vitest';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  update: vi.fn(),
  createMany: vi.fn(),
};

let sut: DeleteCertificateUseCase;

beforeEach(() => {
  vi.clearAllMocks();
  sut = new DeleteCertificateUseCase(certificateRepositoryMock);
});

describe('DeleteCertificateUseCase', () => {
  it('should call repository delete with correct id', async () => {
    const certificateId = 'cert-123';

    await sut.execute(certificateId);

    expect(certificateRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(certificateRepositoryMock.delete).toHaveBeenCalledWith(certificateId);
  });
});
