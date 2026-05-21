import { describe, it, expect } from 'vitest';

import { Certificate } from '@/src/core/entities/certificate.entity';
import { CPF } from '@/src/core/value-objects/cpf.value-object';
import { RegistrationNumber } from '@/src/core/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/value-objects/pts-book.value-object';
import { randomUUID } from 'node:crypto';
import { CertificateType } from '../enums/certificate-type.enum';

const makeProps = () => ({
  id: randomUUID(),
  studentName: 'Fulano de Tal',
  courseName: 'Curso de Teste',
  cpf: new CPF('12345678901'),
  workload: 8,
  completionDate: new Date('2024-01-01'),
  page: new CertificatePage('001/2024'),
  registrationNumber: new RegistrationNumber('0001/2024'),
  ptsBook: new PTSBook('001/2024'),
  createdAt: new Date(),
  type: CertificateType.BRIGADISTA,
});

describe('Certificate entity (unit)', () => {
  it('should create certificate with valid props', () => {
    const props = makeProps();
    const c = new Certificate(props);

    expect(c.id).toBeDefined();
    expect(c.studentName).toBe(props.studentName);
    expect(c.courseName).toBe(props.courseName);
    expect(c.cpf).toBe(props.cpf);
    expect(c.workload).toBe(props.workload);
    expect(c.completionDate.getTime()).toBe(props.completionDate.getTime());
    expect(c.page).toBe(props.page);
    expect(c.registrationNumber).toBe(props.registrationNumber);
    expect(c.ptsBook).toBe(props.ptsBook);
  });

  it('should validate constructor fields', () => {
    const props = makeProps();
    props.studentName = '  ';
    expect(() => new Certificate(props)).toThrow();
  });

  it('should change student name and validate', () => {
    const props = makeProps();
    const c = new Certificate(props);

    c.changeStudentName('Novo Nome');
    expect(c.studentName).toBe('Novo Nome');

    expect(() => c.changeStudentName('  ')).toThrow();
  });

  it('should change cpf and validate', () => {
    const props = makeProps();
    const c = new Certificate(props);

    c.changeCpf(new CPF('98765432100'));
    expect(c.cpf.getValue()).toBe('98765432100');

    expect(() => c.changeCpf(new CPF('123'))).toThrow();
  });

  it('should change workload and validate', () => {
    const props = makeProps();
    const c = new Certificate(props);

    c.changeWorkload(16);
    expect(c.workload).toBe(16);

    expect(() => c.changeWorkload(0)).toThrow();
  });
});
