import { FileCertificateGenerator } from '../../domain/services/file-certificate-generator';
import puppeteer from 'puppeteer';
import { FailFileCertificateGeneratorError } from '../../domain/errors/fail-file-certificate-generate.error';
import { generateCertificateHTML } from '@/src/app/certificado/client';
import fs from 'fs';
import path from 'path';
import { Certificate } from '../../domain/entities/certificate.entity';

export class PuppeteerPDFCertificateGenerator implements FileCertificateGenerator {
  async generate(data: Certificate): Promise<Buffer> {
    let browser;

    try {
      const logoBuffer = fs.readFileSync(
        path.join(process.cwd(), 'src/app/assets/logo.png'),
      );
      const seloBuffer = fs.readFileSync(
        path.join(process.cwd(), 'src/app/assets/selo.png'),
      );

      const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      const seloBase64 = `data:image/png;base64,${seloBuffer.toString('base64')}`;

      // Renderizar o HTML
      const html = generateCertificateHTML({
        courseName: data.courseName,
        cpf: data.getCPFFormatted(),
        date: data.completionDate,
        hours: data.workload,
        logoSrc: logoBase64,
        seloSrc: seloBase64,
        studentName: data.studentName,
        registrationNumber: data?.registrationNumber?.getValue() ?? '0001/2026',
        page: data?.page?.getValue() ?? '001/2026',
        ptsBook: data?.ptsBook?.getValue() ?? '001/2026',
      });

      // Lançar navegador
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Definir conteúdo
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Gerar PDF
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
      });


      return Buffer.from(pdf);
    } catch (error: any) {
      throw new FailFileCertificateGeneratorError(
        `Erro ao gerar PDF: ${error.message}`,
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}