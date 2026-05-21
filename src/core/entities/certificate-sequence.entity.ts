import { CertificateType } from '../enums/certificate-type.enum';

export interface CertificateSequenceProps {
  typeId: string;
  lastRegistrationIndex: number;
  year: number;
  type: CertificateType;
}

export class CertificateSequence {
  private props: CertificateSequenceProps;

  constructor(props: CertificateSequenceProps) {
    this.props = { ...props };
  }

  get id(): string {
    return this.props.typeId;
  }

  get typeId(): string {
    return this.props.typeId;
  }

  get lastRegistrationIndex(): number {
    return this.props.lastRegistrationIndex;
  }

  get year(): number {
    return this.props.year;
  }

  get type(): CertificateType {
    return this.props.type;
  }

  /**
   * Increment the registration counter and return the new index.
   * This is the only mutation — page is always derived from this value.
   */
  nextRegistrationIndex(): number {
    this.props.lastRegistrationIndex += 1;
    return this.props.lastRegistrationIndex;
  }

  /**
   * Formatted registration number string, e.g. "0042/2025"
   */
  currentRegistrationNumber(): string {
    const padded = String(this.props.lastRegistrationIndex).padStart(4, '0');
    return `${padded}/${this.props.year}`;
  }

  /**
   * Page is derived: every 50 certificates = 1 page.
   * Returns formatted string, e.g. "001/2025", "002/2025"
   */
  currentPage(): string {
    const pageIndex = Math.ceil(this.props.lastRegistrationIndex / 50);
    const padded = String(pageIndex).padStart(3, '0');
    return `${padded}/${this.props.year}`;
  }
}
