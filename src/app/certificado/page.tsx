
import { generateCertificateHTML } from './certificate-template';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';

export default async function Page() {

  const html = generateCertificateHTML({
    cpf: '12345678901',
    date: new Date(),
    hours: 10,
    studentName: 'John Doe',
    type: CertificateType.BRIGADISTA,
    page: '001/001',
    registrationNumber: '0001/2026',
    ptsBook: '001/2026',
  });

  return (
    <>
      <div style={{ height: '100vh', background: '#ccc', width: '100%' }}>
        <iframe
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'white',
          }}
          srcDoc={html}
        />
      </div>
    </>
  );
}