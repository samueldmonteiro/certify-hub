
interface CertificateTemplateData {
  studentName: string;
  cpf: string;
  courseName: string;
  date: Date;
  hours: number;
  logoSrc: string;
  seloSrc: string;
  registrationNumber: string;
  page: string;
  ptsBook: string;
}

export function generateCertificateHTML(data: CertificateTemplateData): string {
  const { studentName, cpf, courseName, date, hours, logoSrc, seloSrc, registrationNumber, page, ptsBook } = data;

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
        right:-80px;
        margin-top: 10px;
      }

      .workload {
        margin-top:15px;
        display:block;
        margin-left:5px;
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
          <p>
            que sob o CPF: <strong>${cpf}</strong>, participou do treinamento
            de <strong>${courseName}</strong>, no dia <strong>${date.toLocaleDateString('pt-BR')}</strong>, com
            carga horária de <strong>${hours}h</strong>, conforme <strong>NR</strong>
            <strong>NR 23, NBR 14.276/2020 e NT-17 CBMMA</strong>, tendo seu o aproveitamento satisfatório.
          </p>
        </div>
      </div>

      <div class="footer">
        <div class="signature">
          <img src="${seloSrc}" class="seal" alt="Selo Best Quality" />
          <div>
            <div class="line"></div>
            <strong>COORDENADOR RESPONSÁVEL</strong>
            Rodrigo Márcio Silva de Oliveira<br />
            Engenheiro de Segurança do Trabalho<br />
            Credenciamento CBMMA 991413/092023
          </div>
        </div>
        <div class="signature">
          <div>
            <div class="line"></div>
            <strong>INSTRUTOR PCI E APH</strong>
            Lourival Taveira Lobão Neto<br />
            Bombeiro Industrial Civil<br />
            Credenciamento CBMMA 440229/092023
          </div>
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
        <h2>CONTEÚDO PROGRAMÁTICO :</h2>
        <strong class="sub-title">Prevenção e combate ao princípio de incêndio: Conteúdo teórico e prático</strong>
        <ul>
          <li>Objetivos e atribuições da brigada de incêndio e emergência;</li>
          <li>Teoria do fogo:reação em cadeia elementos, funções, pontos de fulgor, ignição e combustão;</li>
          <li>Formas de  propagação do fogo: condução, irradiação e convecção;</li>
          <li>Classes de incêndio e suas características;</li>
          <li>Prevenção do Incêndio: técnicas de prevenção;</li>
          <li>Métodos de extinção: resfriamento,isolamento, abafamento;</li>
          <li>Equipamentos de combate a incêndio: extintores, hidrantes, mangueiras e acessórios;</li>
          <li>Combate à incêndios em cozinhas industriais, equipamentos e formas de utilização e combate;</li>
          <li>EPI’s- Equipamento de Proteção Individual , sua importância e utilidade;</li>
          <li>Equipamentos de detecção, alarme, luz de emergência e comunicações;</li>
          <li>Abandono de área: técnicas de saída organizada, pontos de encontro, chamada e controle de pânico;</li>
          <li>Atendimento à pessoas com mobilidade reduzida: formas de abordagem durante o atendimento à emergência.</li>
        </ul>
        <h3>Primeiros Socorros : Conteúdo teórico e prático</h3>
        <ul>
          <li>Avaliação inicial do cenário;</li>
          <li>Análise de vítimas, avaliações primária e secundária;</li>
          <li>Obstrução de vias aéreas por corpos estranhos (OVACE);</li>
          <li>RCP – Reanimação Cárdio Pulmonar;</li>
          <li>Estado de choque, crises emocionais: classificação,avaliação dos sinais e técnicas de prevenção e tratamento;</li>
          <li>Hemorragias: Tipos, Classificação e tratamento;</li>
          <li>Fraturas;</li>
          <li>Queimaduras;</li>
          <li>Manipulação e transporte de vítimas.</li>
          <li>Fraturas: Tipos, Classificação e tratamento;</li>
          <li>Queimaduras: Tipos, Classificação e tratamento;</li>
          <li>Manipulação e  transporte de vítimas;</li>
        </ul>
        <strongc class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
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
          NR-23 NBR 14.276/2020 NT 17 CBMMA
        </div>
        <div class="box small-text">
          Este certificado tem validade para prova de títulos,fins curriculares e demais utilidades,na qualidade para o curso de BRIGADISTA,respeitando-se os conteúdos e  carga horária, conforme NBR 14.276/2020 e NT17 parte 1 CBMMA, não podendo ser utilizado para outros fins.
        </div>
      </div>
    </div>
  </body>
</html>`;
}