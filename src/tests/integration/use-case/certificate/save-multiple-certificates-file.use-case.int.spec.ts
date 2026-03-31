import { beforeEach, describe, it, expect } from 'vitest';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { RegisterCertificatesUseCase } from '@/src/core/application/use-cases/certificate/register-certificates.use-case';
import { PrismaCertificateRepository } from '@/src/core/infra/database/prisma/prisma-certificate.repository';
import { PrismaCertificateSequenceRepository } from '@/src/core/infra/database/prisma/prisma-certificate-sequence.repository';
import { prisma } from '@/src/lib/prisma';

let sut: RegisterCertificatesUseCase;

beforeEach(async () => {
  sut = new RegisterCertificatesUseCase(
    new PrismaCertificateRepository(),
    new PrismaCertificateSequenceRepository(),
  );
  await prisma.certificate.deleteMany({});
  await prisma.certificateSequence.deleteMany({});
});

describe('RegisterCertificatesUseCase (Int)', () => {
  it('should register multiple certificates in the database without generating files', async () => {
    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8 },
      { completionDate: new Date('2024-04-04'), courseName: 'Course 2', cpf: new CPF('62910723356'), studentName: 'Student 2', workload: 9 },
    ];

    const response = await sut.execute(draftCerts);

    expect(response.certificates).toHaveLength(2);
    expect(response.certificates[0].courseName).toBe('Course 1');
    expect(response.certificates[1].courseName).toBe('Course 2');

    const dbCount = await prisma.certificate.count();
    expect(dbCount).toBe(2);
  });

  it('should persist message field when provided', async () => {
    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8, message: 'Mensagem personalizada de teste' },
    ];

    const response = await sut.execute(draftCerts);

    expect(response.certificates[0].message).toBe('Mensagem personalizada de teste');

    const dbCert = await prisma.certificate.findUnique({ where: { id: response.certificates[0].id } });
    expect(dbCert?.message).toBe('Mensagem personalizada de teste');
  });

  it('should generate sequential registration numbers from sequence table', async () => {
    const currentYear = new Date().getFullYear();

    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8 },
      { completionDate: new Date('2024-04-04'), courseName: 'Course 2', cpf: new CPF('62910723356'), studentName: 'Student 2', workload: 9 },
    ];

    const response = await sut.execute(draftCerts);

    expect(response.certificates[0].registrationNumber.getValue()).toBe(`0001/${currentYear}`);
    expect(response.certificates[1].registrationNumber.getValue()).toBe(`0002/${currentYear}`);

    // Sequence counter should be at 2
    const seq = await prisma.certificateSequence.findFirst({ where: { year: currentYear } });
    expect(seq?.lastRegistrationIndex).toBe(2);
  });

  it('should not reuse a deleted certificate number — sequence is never decremented', async () => {
    const currentYear = new Date().getFullYear();

    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8 },
      { completionDate: new Date('2024-04-04'), courseName: 'Course 2', cpf: new CPF('62910723356'), studentName: 'Student 2', workload: 9 },
      { completionDate: new Date('2024-06-06'), courseName: 'Course 3', cpf: new CPF('62910723356'), studentName: 'Student 3', workload: 10 },
    ];

    const first = await sut.execute(draftCerts);

    // Delete the 2nd certificate
    await prisma.certificate.delete({ where: { id: first.certificates[1].id } });

    // Register one more — must be 0004, NOT 0003 (which was already issued)
    const second = await sut.execute([
      { completionDate: new Date('2024-08-08'), courseName: 'Course 4', cpf: new CPF('62910723356'), studentName: 'Student 4', workload: 6 },
    ]);

    expect(second.certificates[0].registrationNumber.getValue()).toBe(`0004/${currentYear}`);
  });
});
