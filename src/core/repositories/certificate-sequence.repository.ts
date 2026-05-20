import { CertificateSequence } from '../entities/certificate-sequence.entity';
import { CertificateType } from '../enums/certificate-type.enum';

export interface ICertificateSequenceRepository {
  /**
   * Returns the current sequence for the given year, or null if it doesn't exist yet.
   */
  findByYear(year: number): Promise<CertificateSequence | null>;
  findByYearAndType(year: number, type: CertificateType): Promise<CertificateSequence | null>;

  /**
   * Creates a new sequence record (first certificate of the year).
   */
  create(sequence: CertificateSequence): Promise<CertificateSequence>;

  /**
   * Persists an updated sequence (after incrementing).
   */
  save(sequence: CertificateSequence): Promise<CertificateSequence>;
}
