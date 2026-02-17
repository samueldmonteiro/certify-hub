import { FileCertificateGenerator } from '../../domain/services/file-certificate-generator';
import { chromium } from 'playwright';
import { FailFileCertificateGeneratorError } from '../../domain/errors/fail-file-certificate-generate.error';
import { generateCertificateHTML } from '@/src/app/certificado/certificate-template';
import path from 'path';
import fs from 'fs';
import { Certificate } from '../../domain/entities/certificate.entity';
import { CertificateDraft } from '../../domain/value-objects/certificate-draft.value-object';

export class PlaywrightPDFCertificateGenerator implements FileCertificateGenerator {

  async generate(data: Certificate, draft: CertificateDraft): Promise<Buffer> {

    try {
      const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/logo.png'));
      const seloBuffer = fs.readFileSync(path.join(process.cwd(), 'src/app/assets/selo.png'));

      const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      const seloBase64 = `data:image/png;base64,${seloBuffer.toString('base64')}`;

      const html = generateCertificateHTML({
        courseName: data.courseName,
        cpf: data.getCPFFormatted(),
        date: data.completionDate,
        hours: data.workload,
        logoSrc: logoBase64,
        seloSrc: seloBase64,
        registrationNumber: data?.registrationNumber?.getValue() ?? '0001/2026',
        page: data?.page?.getValue() ?? '001/2026',
        ptsBook: data?.ptsBook?.getValue() ?? '001/2026',
        studentName: data.studentName,
        summary: draft.summary,
      });

      const browser = await chromium.launch();
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: 'networkidle',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      return pdf;
    } catch (error: any) {
      throw new FailFileCertificateGeneratorError(error.message);
    }
  }
}