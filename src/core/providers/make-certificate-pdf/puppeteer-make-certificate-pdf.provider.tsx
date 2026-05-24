import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { FailFileCertificateGeneratorError } from '../../errors/fail-file-certificate-generate.error';
import { generateCertificateHTML } from '@/src/app/certificado/certificate-template';
import { Certificate } from '../../entities/certificate.entity';
import { IMakeCertificatePdfProvider } from './make-certificate-pdf.provider';

export class PuppeteerMakeCertificatePdfProvider implements IMakeCertificatePdfProvider {
  async generatePDF(data: Certificate): Promise<Buffer> {
    let browser;

    try {

      // Renderizar o HTML
      const html = generateCertificateHTML({
        cpf: data.getCPFFormatted(),
        date: data.completionDate,
        hours: data.workload,
        studentName: data.studentName,
        registrationNumber: data?.registrationNumber?.getValue() ?? '0001/2026',
        page: data?.page?.getValue() ?? '001/2026',
        ptsBook: data?.ptsBook?.getValue() ?? '001/2026',
        type: data.type,
      });

      // Lançar navegador
      const executablePath = await this.resolveExecutablePath();

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      });

      const page = await browser.newPage();

      // Definir conteúdo
      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
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

  private async resolveExecutablePath(): Promise<string> {
    if (process.env.CHROMIUM_PATH) {
      return process.env.CHROMIUM_PATH;
    }

    // Em produção (Vercel), usar a URL externa do pack para evitar erros de binário ausente
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      
      const packUrl = 'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar';
      return await chromium.executablePath(packUrl);
    }

    // No desenvolvimento local, tentar resolver o executável empacotado
    return await chromium.executablePath();
  }
}