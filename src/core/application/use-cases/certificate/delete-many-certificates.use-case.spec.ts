import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { DeleteManyCertificatesUseCase } from './delete-many-certificates.use-case';
import { describe, it, expect, vi, Mocked, beforeEach } from 'vitest';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
};

let sut: DeleteManyCertificatesUseCase;

beforeEach(() => {
  vi.clearAllMocks();
  sut = new DeleteManyCertificatesUseCase(certificateRepositoryMock);
});

describe('DeleteManyCertificatesUseCase', () => {
  it('should call repository deleteMany with correct ids', async () => {
    const ids = ['cert-1', 'cert-2', 'cert-3'];

    await sut.execute(ids);

    expect(certificateRepositoryMock.deleteMany).toHaveBeenCalledTimes(1);
    expect(certificateRepositoryMock.deleteMany).toHaveBeenCalledWith(ids);
  });
});
