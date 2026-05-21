import { beforeEach, describe, it, expect } from 'vitest';
import { PrismaCertificateRepository } from '@/src/core/repositories/prisma/prisma-certificate.repository';
import { CertificateService } from '@/src/core/services/certificate.service';
import { PuppeteerMakeCertificatePdfProvider } from '@/src/core/providers/make-certificate-pdf/puppeteer-make-certificate-pdf.provider';
import { prisma } from '@/src/lib/prisma';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';

describe('CertificateService (Integration)', () => {
  let sut: CertificateService;

  beforeEach(async () => {
    await prisma.certificate.deleteMany();
    await prisma.certificateSequence.deleteMany();

    const certificateRepo = new PrismaCertificateRepository();
    const pdfProvider = new PuppeteerMakeCertificatePdfProvider();
    sut = new CertificateService(certificateRepo, pdfProvider);
  });

  describe('generatePdf', () => {
    it('should generate a PDF buffer and save it to /tmp for an existing certificate', async () => {
      const created = await prisma.certificate.create({
        data: {
          studentName: 'Maria Silva',
          courseName: 'Brigada de Incêndio',
          cpf: '62910723356',
          workload: 8,
          completionDate: new Date('2024-02-02'),
          page: '001/2024',
          registrationNumber: '0001/2024',
          ptsBook: '001/2024',
          type: CertificateType.DIRECAO_DEFENSIVA,
        },
      });

      const { buffer, filename } = await sut.generatePdf(created.id);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      expect(filename).toBe('certificado_maria_silva.pdf');

      const outputPath = `/tmp/${filename}`;
      const fs = await import('fs');
      fs.writeFileSync(outputPath, buffer);

      expect(fs.existsSync(outputPath)).toBe(true);

      const stats = fs.statSync(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should throw ResourceNotFoundError when certificate does not exist', async () => {
      const { ResourceNotFoundError } = await import('@/src/core/errors/resource-not-found.error');

      await expect(sut.generatePdf('non-existent-id')).rejects.toThrow(ResourceNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete an existing certificate', async () => {
      const created = await prisma.certificate.create({
        data: {
          studentName: 'João Pereira',
          courseName: 'Brigada de Incêndio',
          cpf: '62910723356',
          workload: 8,
          completionDate: new Date('2024-02-02'),
          page: '001/2024',
          registrationNumber: '0002/2024',
          ptsBook: '001/2024',
          type: CertificateType.BRIGADISTA,
        },
      });

      await sut.delete(created.id);

      const dbCert = await prisma.certificate.findUnique({ where: { id: created.id } });
      expect(dbCert).toBeNull();
    });

    it('should throw when deleting a non-existent certificate', async () => {
      await expect(sut.delete('non-existent-id')).rejects.toThrow();
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple existing certificates', async () => {
      const cert1 = await prisma.certificate.create({
        data: {
          studentName: 'Ana Costa',
          courseName: 'Brigada de Incêndio',
          cpf: '62910723356',
          workload: 8,
          completionDate: new Date('2024-02-02'),
          page: '001/2024',
          registrationNumber: '0003/2024',
          ptsBook: '001/2024',
          type: CertificateType.BRIGADISTA,
        },
      });
      const cert2 = await prisma.certificate.create({
        data: {
          studentName: 'Carlos Souza',
          courseName: 'Brigada de Incêndio',
          cpf: '62910723356',
          workload: 8,
          completionDate: new Date('2024-02-02'),
          page: '001/2024',
          registrationNumber: '0004/2024',
          ptsBook: '001/2024',
          type: CertificateType.BRIGADISTA,
        },
      });

      await sut.deleteMany([cert1.id, cert2.id]);

      const remaining = await prisma.certificate.count();
      expect(remaining).toBe(0);
    });

    it('should not throw when deleting non-existent ids', async () => {
      await expect(sut.deleteMany(['non-existent-1', 'non-existent-2'])).resolves.not.toThrow();
    });
  });

  describe('update', () => {
    it('should update all fields of a certificate', async () => {
      const created = await prisma.certificate.create({
        data: {
          studentName: 'Antigo Nome',
          courseName: 'Curso Antigo',
          cpf: '62910723356',
          workload: 4,
          completionDate: new Date('2023-01-01'),
          page: '001/2023',
          registrationNumber: '0005/2024',
          ptsBook: '001/2023',
          type: CertificateType.CIPEIRO,
        },
      });

      const result = await sut.update({
        id: created.id,
        studentName: 'Novo Nome',
        courseName: 'Curso Novo',
        cpf: '98765432100',
        workload: 16,
        completionDate: new Date('2024-06-15'),
        registrationNumber: '0100/2024',
        page: '050/2024',
        ptsBook: '010/2024',
      });

      expect(result.certificate.studentName).toBe('Novo Nome');
      expect(result.certificate.courseName).toBe('Curso Novo');
      expect(result.certificate.workload).toBe(16);
      expect(result.certificate.cpf.getValue()).toBe('98765432100');
      expect(result.certificate.completionDate).toEqual(new Date('2024-06-15'));
      expect(result.certificate.registrationNumber.getValue()).toBe('0100/2024');
      expect(result.certificate.page.getValue()).toBe('050/2024');
      expect(result.certificate.ptsBook.getValue()).toBe('010/2024');

      const dbCert = await prisma.certificate.findUnique({ where: { id: created.id } });
      expect(dbCert?.studentName).toBe('Novo Nome');
    });

    it('should partially update only provided fields', async () => {
      const created = await prisma.certificate.create({
        data: {
          studentName: 'Nome Original',
          courseName: 'Curso Original',
          cpf: '62910723356',
          workload: 8,
          completionDate: new Date('2024-02-02'),
          page: '001/2024',
          registrationNumber: '0006/2024',
          ptsBook: '001/2024',
          type: CertificateType.BRIGADISTA,
        },
      });

      const result = await sut.update({
        id: created.id,
        studentName: 'Nome Atualizado',
      });

      expect(result.certificate.studentName).toBe('Nome Atualizado');
      expect(result.certificate.courseName).toBe('Curso Original');
      expect(result.certificate.workload).toBe(8);
    });

    it('should throw DomainError when updating a non-existent certificate', async () => {
      const { DomainError } = await import('@/src/core/errors/domain.error');

      await expect(
        sut.update({
          id: 'non-existent-id',
          studentName: 'Novo Nome',
        }),
      ).rejects.toThrow(DomainError);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await prisma.certificate.createMany({
        data: [
          {
            studentName: 'Alice Martins',
            courseName: 'Brigada de Incêndio',
            cpf: '62910723356',
            workload: 8,
            completionDate: new Date('2024-01-01'),
            page: '001/2024',
            registrationNumber: '0007/2024',
            ptsBook: '001/2024',
            type: CertificateType.BRIGADISTA,
          },
          {
            studentName: 'Bruno Lima',
            courseName: 'Cipeiro',
            cpf: '98765432100',
            workload: 16,
            completionDate: new Date('2024-02-02'),
            page: '001/2024',
            registrationNumber: '0008/2024',
            ptsBook: '001/2024',
            type: CertificateType.CIPEIRO,
          },
          {
            studentName: 'Carla Dias',
            courseName: 'Direção Defensiva',
            cpf: '62910723356',
            workload: 8,
            completionDate: new Date('2024-03-03'),
            page: '002/2024',
            registrationNumber: '0009/2024',
            ptsBook: '002/2024',
            type: CertificateType.DIRECAO_DEFENSIVA,
          },
        ],
      });
    });

    it('should return all certificates with default pagination', async () => {
      const result = await sut.search({});

      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });

    it('should filter by studentName', async () => {
      const result = await sut.search({ studentName: 'Alice' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].studentName).toBe('Alice Martins');
    });

    it('should filter by courseName', async () => {
      const result = await sut.search({ courseName: 'Cipeiro' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].courseName).toBe('Cipeiro');
    });

    it('should filter by cpf', async () => {
      const result = await sut.search({ cpf: '98765432100' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].cpf.getValue()).toBe('98765432100');
    });

    it('should paginate results', async () => {
      const result = await sut.search({ page: 1, perPage: 2 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(2);
    });

    it('should return empty items when no match is found', async () => {
      const result = await sut.search({ studentName: 'NonExistent' });

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
