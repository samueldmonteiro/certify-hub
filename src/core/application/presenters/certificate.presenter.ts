import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CertificateViewModel } from '../view-models/certificate.view-model';

export class CertificatePresenter {
  static toViewModel(cert: Certificate): CertificateViewModel {
    return {
      id: cert.id,
      completionDate: cert.completionDate,
      courseName: cert.courseName,
      cpf: cert.cpf.getValue(),
      page: cert.page.getValue(),
      registrationNumber: cert.registrationNumber.getValue(),
      ptsBook: cert.ptsBook.getValue(),
      studentName: cert.studentName,
      workload: cert.workload,
      createdAt: cert.createdAt,
      fileURL: cert.fileURL,
    };
  }
  static toManyViewModel(certs: Certificate[]){
    return certs.map(cert=> this.toViewModel(cert));
  }
}
