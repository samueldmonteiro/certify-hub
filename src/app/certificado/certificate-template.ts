
import { CertificateType } from '../../core/enums/certificate-type.enum';
import { certificateContents } from './certificate-contents';
import { imageToBase64 } from '@/src/lib/image-to-base64';
import path from 'path';

export interface CertificateTemplateProps {
  studentName: string;
  cpf: string;
  date: Date;
  hours: number;
  registrationNumber: string;
  page: string;
  ptsBook: string;
  type: CertificateType;
}

export function generateCertificateHTML(data: CertificateTemplateProps): string {
  const { studentName, cpf, date, hours, registrationNumber, page, ptsBook, type } = data;

  const logoSrc = imageToBase64(path.join(process.cwd(), 'src/app/assets/logo.png'));
  const seloSrc = imageToBase64(path.join(process.cwd(), 'src/app/assets/selo.png'));

  const content = certificateContents[type];
  const formattedDate = date.toLocaleDateString('pt-BR');

  const signature1HTML = content.signature1Text.replace(
    '<div class="line"></div>',
    `<img class="signature-img" src="${content.signature1Image}" alt="Assinatura" />
    <div class="line"></div>`,
  );

  const signature2HTML = content.signature2Text.replace(
    '<div class="line"></div>',
    `<img class="signature-img" src="${content.signature2Image}" alt="Assinatura" />
    <div class="line"></div>`,
  );

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      @page {
        size: A4 landscape;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif !important;
      }

      .page {
        position: relative;
        width: 297mm;
        height: 210mm;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      /* ============ ESTILOS DA FRENTE ============ */
      .front {
        background: #f5f5f5;
        color: black;
        font-family: Arial, Helvetica, sans-serif !important;
      }

      .front::before {
        content: '';
        position: absolute;
        top: 6mm;
        left: 6mm;
        right: 6mm;
        bottom: 6mm;
        border: 3px solid #d4af37;
        pointer-events: none;
        z-index: 10;
      }

      .front .decorations {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
      }

      .front .content {
        position: relative;
        z-index: 5;
        text-align: center;
        height: 82%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-top: 20mm;
      }

      .front h1 {
        font-size: 72px;
        color: #b71c1c;
        letter-spacing: 8px;
        margin-top: 0;
        margin-bottom: 8mm;
        font-weight: bold;
        font-style: italic;
      }

      .front .subtitle {
        font-size: 20px;
        color: #b71c1c;
        margin-bottom: 16mm;
      }

      .front .student-name {
        font-size: 32px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 5mm;
        letter-spacing: 6px;
        margin-top:-25px;
      }

      .front .divider {
        width: 58%;
        height: 2px;
        background: #b71c1c;
        margin: 0 auto 12mm auto;
      }

      .front .description {
        font-size: 20px;
        line-height: 1.9;
        padding: 0 60mm;
        width: 1100px;
        margin: 0 auto;
        margin-top: -40px;
      }

      .front .description strong {
        font-weight: 600;
      }

      .front .logo {
        position: absolute;
        top: 15mm;
        right: 15mm;
        width: 140px;
        z-index: 20;
      }

      .front .footer {
        position: absolute;
        bottom: 18mm;
        left: 40mm;
        right: 25mm;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 10;
        margin-left: -120px;
        width: 800px;
      }

      .front .signature {
        text-align: center;
        font-size: 10px;
        line-height: 1.4;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .front .signature .line {
        width: 180px;
        border-top: 1px solid #000;
        margin: 0 auto 6px auto;
      }

      .front .signature strong {
        font-weight: bold;
        display: block;
        margin-bottom: 2px;
      }

      .front .seal {
        width: 150px;
        height: 150px;
        margin: 0 30px;
        position:relative;
        left:-60px;
        display:block;
      }

      /* ============ ESTILOS DO VERSO ============ */
      .back {
        background: #1e1e1ee9;
        color: white;
        overflow: hidden;
      }

      .back::before {
        content: '';
        position: absolute;
        top: 6mm;
        left: 6mm;
        right: 6mm;
        bottom: 6mm;
        border: 2px solid #d4af37;
        z-index: 10;
        pointer-events: none;
      }

      .back svg.decorations {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .back .content-left {
        position: absolute;
        top: 10mm;
        left: 15mm;
        width: 580px;
        z-index: 5;
        font-size: 13px;
        line-height: 1.6;
        border: 1px solid black;
        padding: 5px 12px;
      }

      .back .content-left .sub-title{
        margin-left:5px;
      }

      .back .content-left h2 {
        margin-top: 5px;
        font-size: 15px;
        margin-bottom: 6px;
        font-weight: bold;
        margin-left:5px;
      }

      .back .content-left h3 {
        margin-top: 18px;
        font-size: 14px;
        font-weight: bold;
        margin-left:5px;
        margin-bottom:-3px;
      }

      .back .content-left ul {
        padding-left: 18px;
        margin: 6px 0;
      }

      .back .content-left li {
        margin-bottom: -1px;
        font-size:12px;
      }

      .back .content-right {
        position: absolute;
        top: 10mm;
        right: 15mm;
        width: 30%;
        z-index: 5;
        font-size: 13px;
        text-align: center;
      }

      .back .content-right img {
        position: relative;
        right: -100px;
      }

      .back .box {
        border: 1px solid black;
        padding: 12px;
        margin-bottom: 18px;
      }

      .back .box strong {
        display: block;
        margin-bottom: 6px;
      }

      .back .small-text {
        font-size: 12px;
        line-height: 1.4;
        text-align: justify;
      }

      .back .logo {
        width: 150px;
        display: block;
        position:absolute;
        left: 180px;
      }

      .back .logo-text{
        text-align: center;
        font-size: 12px;
        color: black;
        margin-bottom: 40px;
        position:relative;
        right:-70px;
        margin-top: 10px;
      }

      .workload {
        margin-top:15px;
        display:block;
        margin-left:5px;
      }

      .signature-img {
        width: 130px;
        display: block;
        margin-bottom: -10px;
      }
    </style>
  </head>

  <body>
    <!-- PÁGINA 1: FRENTE DO CERTIFICADO -->
    <div class="page front">
      <svg class="decorations" viewBox="0 0 1000 707" preserveAspectRatio="none">
        <polygon points="0,0 420,0 0,420" fill="#f57c00" />
        <polygon points="0,0 380,0 0,380" fill="#ffb74d" opacity="0.95" />
        <polygon points="0,0 340,0 0,340" fill="#ff9800" opacity="0.9" />
        <polygon points="0,0 280,0 0,280" fill="#d32f2f" opacity="0.85" />
        <line x1="0" y1="220" x2="220" y2="0" stroke="white" stroke-width="8" opacity="0.6" />
        <line x1="0" y1="280" x2="150" y2="130" stroke="white" stroke-width="6" opacity="0.5" />
        <polygon points="0,240 60,180 0,180" fill="white" opacity="0.4" />
        <polygon points="1000,707 580,707 1000,287" fill="#ffb74d" />
        <polygon points="1000,707 620,707 1000,327" fill="#ff9800" opacity="0.95" />
        <polygon points="1000,707 680,707 1000,387" fill="#d32f2f" opacity="0.9" />
        <polygon points="1000,707 740,707 1000,447" fill="#f57c00" opacity="0.85" />
        <rect x="880" y="600" width="80" height="100" fill="#ff6f00" opacity="0.7" transform="rotate(45 920 650)" />
        <line x1="1000" y1="487" x2="780" y2="707" stroke="white" stroke-width="8" opacity="0.6" />
        <line x1="1000" y1="427" x2="850" y2="577" stroke="white" stroke-width="6" opacity="0.5" />
      </svg>

      <img src="${logoSrc}" class="logo" alt="Logo Preservar" />

      <div class="content">
        <h1>CERTIFICADO</h1>
        <p class="subtitle">Certificamos que</p>
        <p class="student-name">${studentName}</p>
        <div class="divider"></div>
        <div class="description">
          <p>${content.frontDescription(studentName, cpf, formattedDate, hours)}</p>
        </div>
      </div>

      <div class="footer">
        <div class="signature">
          <img src="${seloSrc}" class="seal" alt="Selo Best Quality" />
          ${signature1HTML}
        </div>
        <div class="signature">
          ${signature2HTML}
        </div>
      </div>
    </div>

    <!-- PÁGINA 2: VERSO DO CERTIFICADO -->
    <div class="page back">
     <svg class="decorations" viewBox="0 0 1000 707" preserveAspectRatio="none">
    <polygon points="0,0 420,0 0,420" fill="#d84315" opacity="0.7" />
    <polygon points="0,0 380,0 0,380" fill="#e65100" opacity="0.65" />
    <polygon points="0,0 340,0 0,340" fill="#ef6c00" opacity="0.6" />
    <polygon points="0,0 280,0 0,280" fill="#b71c1c" opacity="0.55" />
    <line x1="0" y1="220" x2="220" y2="0" stroke="white" stroke-width="8" opacity="0.4" />
    <line x1="0" y1="280" x2="150" y2="130" stroke="white" stroke-width="6" opacity="0.35" />
    <polygon points="0,240 60,180 0,180" fill="white" opacity="0.3" />
    <polygon points="1000,707 580,707 1000,287" fill="#e65100" opacity="0.7" />
    <polygon points="1000,707 620,707 1000,327" fill="#ef6c00" opacity="0.65" />
    <polygon points="1000,707 680,707 1000,387" fill="#b71c1c" opacity="0.6" />
    <polygon points="1000,707 740,707 1000,447" fill="#d84315" opacity="0.55" />
    <rect x="880" y="600" width="80" height="100" fill="#d84315" opacity="0.5" transform="rotate(45 920 650)" />
    <line x1="1000" y1="487" x2="780" y2="707" stroke="white" stroke-width="8" opacity="0.4" />
    <line x1="1000" y1="427" x2="850" y2="577" stroke="white" stroke-width="6" opacity="0.35" />
</svg>

      <div class="content-left">
        ${content.programmaticContent}
      </div>

      <div class="content-right">
        <img src="${logoSrc}" class="logo" />
        <div class="logo-text">
        CNPJ: 37.075.049/0001-13<br>
        Avenida 03,nº 13, Conjunto Vinhais<br>
        CEP 65071-020, São Luís - MA
        </div>
        <div class="box">
          <strong>PRESERVAR Serviços e Treinamentos</strong>
          <p>37.075.049/0001-13</p>
          <p>Registro Nº ${registrationNumber}</p>
          <p>Folha ${page}</p>
          <p>Livro PTS ${ptsBook}</p>
        </div>
        <div class="box">
          <strong>Certificado emitido conforme</strong>
          ${content.legalTextRight}
        </div>
        <div class="box small-text">
          ${content.validityText}
        </div>
      </div>
    </div>
  </body>
</html>`;
}