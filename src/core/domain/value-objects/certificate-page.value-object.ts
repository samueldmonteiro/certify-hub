import { DomainError } from '../errors/domain.error';

export class CertificatePage {
  private readonly value: string;

  constructor(value: string) {
   
    const normalized = value.trim();

    const parts = normalized.split('/');
    if (parts.length !== 2) {
      throw new DomainError('Formato inválido para CertificatePage. Deve ser NNN/YYYY');
    }

    const [pagePart, yearPart] = parts;

    const pageDigits = pagePart.replace(/\D/g, '');
    const yearDigits = yearPart.replace(/\D/g, '');

    if (!/^[0-9]{1,3}$/.test(pageDigits)) {
      throw new DomainError('Número de página inválido');
    }

    if (!/^[0-9]{4}$/.test(yearDigits)) {
      throw new DomainError('Ano inválido para CertificatePage');
    }

    const pageNumber = Number(pageDigits);
    if (pageNumber < 1 || pageNumber > 999) {
      throw new DomainError('Número de página deve estar entre 1 e 999');
    }

    const padded = String(pageNumber).padStart(3, '0');
    this.value = `${padded}/${yearDigits}`;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.getValue();
  }

  equals(other: CertificatePage): boolean {
    return other instanceof CertificatePage && other.getValue() === this.getValue();
  }
}
