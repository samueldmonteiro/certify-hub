import { DomainError } from '../errors/domain.error';

export class RegistrationNumber {
  private readonly value: string;

  constructor(value: string) {
   
    const normalized = value.trim();

    const parts = normalized.split('/');
    if (parts.length !== 2) {
      throw new DomainError('Formato inválido para RegistrationNumber. Deve ser NNNN/YYYY');
    }

    const [pagePart, yearPart] = parts;

    const pageDigits = pagePart.replace(/\D/g, '');
    const yearDigits = yearPart.replace(/\D/g, '');

    if (!/^[0-9]{1,4}$/.test(pageDigits)) {
      throw new DomainError('Número de registro inválido');
    }

    if (!/^[0-9]{4}$/.test(yearDigits)) {
      throw new DomainError('Ano inválido para RegistrationNumber');
    }

    const pageNumber = Number(pageDigits);
    if (pageNumber < 1 || pageNumber > 9999) {
      throw new DomainError('Número de registro deve estar entre 1 e 9999');
    }

    const padded = String(pageNumber).padStart(4, '0');
    this.value = `${padded}/${yearDigits}`;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.getValue();
  }

  equals(other: RegistrationNumber): boolean {
    return other instanceof RegistrationNumber && other.getValue() === this.getValue();
  }
}
