import { DomainError } from '../errors/domain.error';
import { CertificatePage } from '../value-objects/certificate-page.value-object';
import { CPF } from '../value-objects/cpf.value-object';
import { PTSBook } from '../value-objects/pts-book.value-object';
import { RegistrationNumber } from '../value-objects/registration-number.value-object';

export interface CertificateProps {
  id: string,
  studentName: string,
  courseName: string,
  cpf: CPF,
  workload: number,
  completionDate: Date,
  page: CertificatePage,
  registrationNumber: RegistrationNumber,
  ptsBook: PTSBook,
  createdAt: Date,
  fileURL?: string
}

export class Certificate {
  private props: CertificateProps;

  constructor(props: CertificateProps) {
    this.validateConstructor(props);
    this.props = { ...props };
  }

  private validateConstructor(props: CertificateProps) {
    if (props.studentName.trim().length < 3) {
      throw new DomainError('Nome do estudante deve conter pelo menos 3 caracteres');
    }

    if (props.courseName.trim().length < 3) {
      throw new DomainError('Nome do estudante deve conter pelo menos 3 caracteres');
    }

    if (props.workload <= 0) {
      throw new DomainError('Carga horária deve ser um número maior que zero');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get studentName(): string {
    return this.props.studentName;
  }

  get courseName(): string {
    return this.props.courseName;
  }

  get cpf(): CPF {
    return this.props.cpf;
  }

  get workload(): number {
    return this.props.workload;
  }

  get completionDate(): Date {
    return this.props.completionDate;
  }

  get page(): CertificatePage {
    return this.props.page;
  }

  get registrationNumber(): RegistrationNumber {
    return this.props.registrationNumber;
  }

  get ptsBook(): PTSBook {
    return this.props.ptsBook;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get fileURL(): string|undefined {
    return this.props.fileURL;
  }

  changeStudentName(newName: string): void {
    if (newName.trim().length < 3) {
      throw new DomainError('Nome do estudante deve conter pelo menos 3 caracteres');
    }
    this.props.studentName = newName.trim();
  }

  changeCourseName(newCourse: string): void {
    if (newCourse.trim().length < 2) {
      throw new DomainError('Nome do curso inválido');
    }
    this.props.courseName = newCourse.trim();
  }

  changeCpf(newCpf: CPF): void {
    this.props.cpf = newCpf;
  }

  changeWorkload(hours: number): void {
    if (hours <= 0) {
      throw new DomainError('Carga horária deve ser um número maior que zero');
    }
    this.props.workload = hours;
  }

  changeCompletionDate(date: Date): void {
    this.props.completionDate = date;
  }

  changePage(newPage: CertificatePage): void {
    this.props.page = newPage;
  }

  changeRegistrationNumber(newReg: RegistrationNumber): void {
    this.props.registrationNumber = newReg;
  }

  changePtsBook(newPts: PTSBook): void {
    this.props.ptsBook = newPts;
  }
}