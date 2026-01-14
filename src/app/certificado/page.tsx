import { generateCertificateHTML } from './client';
import fs from 'fs';
import path from 'path';

export default async function Page(){

  const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/logo.png'));
  const seloBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/selo.png'));
        
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  const seloBase64 = `data:image/png;base64,${seloBuffer.toString('base64')}`;
        
  const result = generateCertificateHTML({
    courseName: 'Course test',
    cpf: '6392029202',
    studentName: 'Samuel Davi Gonçalves Monteiro',
    date: new Date(),
    hours: 8,
    logoSrc: logoBase64,
    seloSrc: seloBase64,
  });

  return (
    <>
      <div style={{ height: '100vh', background: '#ccc' }}>
        <iframe
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'white',
          }}
          srcDoc={result}
        />
      </div>
    </>
  );
}