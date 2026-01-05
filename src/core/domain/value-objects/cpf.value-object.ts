export class CPF {
  private readonly value: string;

  constructor(value: string) {
    const digits = value.replace(/\D/g, '');

    if (digits.length !== 11) {
      throw new Error('CPF inválido');
    }

    this.value = digits;
  }

  getValue() {
    return this.value;
  }
}
