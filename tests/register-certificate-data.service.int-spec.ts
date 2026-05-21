import { beforeEach, describe, it, expect } from 'vitest';
import { PrismaCertificateRepository } from '@/src/core/repositories/prisma/prisma-certificate.repository';
import { PrismaCertificateSequenceRepository } from '@/src/core/repositories/prisma/prisma-certificate-sequence.repository';
import { RegisterCertificateDataService } from '@/src/core/services/register-certificate-data.service';
import { prisma } from '@/src/lib/prisma';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';

describe('RegisterCertificateDataService (Integration)', () => {
  let sut: RegisterCertificateDataService;
  const currentYear = new Date().getFullYear();

  beforeEach(async () => {
    await prisma.certificate.deleteMany();
    await prisma.certificateSequence.deleteMany();

    const certificateRepo = new PrismaCertificateRepository();
    const sequenceRepo = new PrismaCertificateSequenceRepository();
    sut = new RegisterCertificateDataService(certificateRepo, sequenceRepo);
  });

  it('should persist certificates and create a sequence in the database', async () => {
    const result = await sut.register([
      {
        studentName: 'Alice',
        cpf: '62910723356',
        date: new Date('2024-02-02'),
        hours: 8,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    const dbCerts = await prisma.certificate.findMany();
    expect(dbCerts).toHaveLength(1);
    expect(dbCerts[0].studentName).toBe('Alice');
    expect(dbCerts[0].registrationNumber).toBe(
      result.certificates[0].registrationNumber.getValue(),
    );

    const dbSeq = await prisma.certificateSequence.findUnique({
      where: {
        type_year: { type: CertificateType.BRIGADISTA, year: currentYear },
      },
    });
    expect(dbSeq).not.toBeNull();
    expect(dbSeq!.lastRegistrationIndex).toBe(1);
  });

  it('should continue numbering from the existing sequence on subsequent registrations', async () => {
    await sut.register([
      {
        studentName: 'Alice',
        cpf: '62910723356',
        date: new Date('2024-02-02'),
        hours: 8,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    const result = await sut.register([
      {
        studentName: 'Bob',
        cpf: '62910723356',
        date: new Date('2024-03-03'),
        hours: 12,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    expect(result.certificates[0].registrationNumber.getValue()).toBe(
      `0002/${currentYear}`,
    );

    const dbSeq = await prisma.certificateSequence.findUnique({
      where: {
        type_year: { type: CertificateType.BRIGADISTA, year: currentYear },
      },
    });
    expect(dbSeq!.lastRegistrationIndex).toBe(2);
  });

  it('should create a new sequence for a type not yet registered in the year', async () => {
    await sut.register([
      {
        studentName: 'Alice',
        cpf: '62910723356',
        date: new Date('2024-02-02'),
        hours: 8,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    await sut.register([
      {
        studentName: 'Bob',
        cpf: '62910723356',
        date: new Date('2024-03-03'),
        hours: 12,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    const seq = await prisma.certificateSequence.findUnique({
      where: {
        type_year: { type: CertificateType.BRIGADISTA, year: currentYear },
      },
    });
    expect(seq!.lastRegistrationIndex).toBe(2);
  });

  it('should allow certificates with the same registration number from different types', async () => {
    await sut.register([
      {
        studentName: 'Alice',
        cpf: '62910723356',
        date: new Date('2024-02-02'),
        hours: 8,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    const result = await sut.register([
      {
        studentName: 'Bob',
        cpf: '62910723356',
        date: new Date('2024-03-03'),
        hours: 12,
        type: CertificateType.CIPEIRO,
      },
    ]);

    // Each type has its own sequence, so both start at 0001/{year}
    expect(result.certificates[0].registrationNumber.getValue()).toBe(`0001/${currentYear}`);
    expect(result.certificates[0].type).toBe(CertificateType.CIPEIRO);

    const cipSeq = await prisma.certificateSequence.findUnique({
      where: {
        type_year: { type: CertificateType.CIPEIRO, year: currentYear },
      },
    });
    expect(cipSeq).not.toBeNull();
    expect(cipSeq!.lastRegistrationIndex).toBe(1);
  });

  it('should assign page 002 and registration 0051 when registering 51 certificates of the same type', async () => {
    const requests = Array.from({ length: 51 }, (_, i) => ({
      studentName: `Student ${i + 1}`,
      cpf: '62910723356',
      date: new Date('2024-02-02'),
      hours: 8,
      type: CertificateType.BRIGADISTA as const,
    }));

    const result = await sut.register(requests);

    expect(result.certificates[0].page.getValue()).toBe(
      `001/${currentYear}`,
    );
    expect(result.certificates[49].page.getValue()).toBe(
      `001/${currentYear}`,
    );
    expect(result.certificates[50].page.getValue()).toBe(
      `002/${currentYear}`,
    );
    expect(result.certificates[50].registrationNumber.getValue()).toBe(
      `0051/${currentYear}`,
    );

    const dbCerts = await prisma.certificate.findMany({
      orderBy: { registrationNumber: 'asc' },
    });
    expect(dbCerts).toHaveLength(51);
    expect(dbCerts[50].registrationNumber).toBe(`0051/${currentYear}`);
  });

  it('should register a certificate even when the registration number already exists for the same type', async () => {
    await sut.register([
      {
        studentName: 'Alice',
        cpf: '62910723356',
        date: new Date('2024-02-02'),
        hours: 8,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    // Manually insert a cert with the same registration number that the sequence would generate next
    await prisma.certificate.create({
      data: {
        id: 'pre-existing-cert',
        studentName: 'Intruder',
        courseName: 'Brigadista',
        cpf: '62910723356',
        workload: 8,
        completionDate: new Date(),
        page: `001/${currentYear}`,
        registrationNumber: `0002/${currentYear}`,
        ptsBook: `001/${currentYear}`,
        type: CertificateType.BRIGADISTA,
      },
    });

    // Should succeed even with the duplicate registration number
    const result = await sut.register([
      {
        studentName: 'Bob',
        cpf: '62910723356',
        date: new Date('2024-03-03'),
        hours: 12,
        type: CertificateType.BRIGADISTA,
      },
    ]);

    expect(result.certificates).toHaveLength(1);
    expect(result.certificates[0].studentName).toBe('Bob');

    // Sequence should still be incremented correctly
    const dbSeq = await prisma.certificateSequence.findUnique({
      where: {
        type_year: { type: CertificateType.BRIGADISTA, year: currentYear },
      },
    });
    expect(dbSeq!.lastRegistrationIndex).toBe(2);
  });
});
