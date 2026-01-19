import { generateCertificateHTML } from './client';
import fs from 'fs';
import path from 'path';

export default async function Page() {

  const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/logo.png'));
  const seloBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/selo.png'));

  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  const seloBase64 = `data:image/png;base64,${seloBuffer.toString('base64')}`;

  const html = generateCertificateHTML({
    courseName: 'Curso de Teste',
    cpf: '12345678901',
    date: new Date(),
    hours: 10,
    logoSrc: logoBase64,
    seloSrc: seloBase64,
    studentName: 'John Doe',
    registrationNumber: '0001/2026',
    page: '001/2026',
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