export function generateCertificateBackHTML(data: {
  logoSrc: string
}): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4 landscape;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        width: 310mm;
        height: 235mm;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: #1e1e1e;
        color: white;
      }

      .page {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      /* BORDA DOURADA */
      .page::before {
        content: '';
        position: absolute;
        top: 5mm;
        left: 10mm;
        right: 10mm;
        bottom: 20mm;
        border: 2px solid #d4af37;
        z-index: 10;
        pointer-events: none;
      }

      /* FUNDO SVG */
      svg.decorations {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      /* BLOCO ESQUERDO */
      .content-left {
        position: absolute;
        top: 25mm;
        left: 25mm;
        width: 450px;
        z-index: 5;
        font-size: 13px;
        line-height: 1.6;
        border: 1px solid black;
        padding:5px 12px;
      }

      .content-left h2 {
      margin-top:5px;
        font-size: 15px;
        margin-bottom: 6px;
        font-weight: bold;
      }

      .content-left h3 {
        margin-top: 18px;
        font-size: 14px;
        font-weight: bold;
      }

      .content-left ul {
        padding-left: 18px;
        margin: 6px 0;
      }

      .content-left li {
        margin-bottom: 4px;
      }

      /* BLOCO DIREITO */
      .content-right {
        position: absolute;
        top: 35mm;
        right: 35mm;
        width: 30%;
        z-index: 5;
        font-size: 13px;
        text-align: center;
        background:red;
      }

      .content-right img {
      position:relative;
      right:-40px;
      }

      .box {
        border: 1px solid rgba(255,255,255,0.5);
        padding: 12px;
        margin-bottom: 18px;
      }

      .box strong {
        display: block;
        margin-bottom: 6px;
      }

      .small-text {
        font-size: 12px;
        line-height: 1.4;
        text-align: justify;
      }

      /* LOGO */
      .logo {
        width: 110px;
        margin: 0 auto 10px auto;
        display: block;
      }
    </style>
  </head>

  <body>
    <div class="page">

      <!-- FUNDO -->
      <svg class="decorations" viewBox="0 0 1000 707" preserveAspectRatio="none">
        <!-- Faixas diagonais -->
        <polygon points="0,0 400,0 0,400" fill="#f57c00" />
        <polygon points="0,0 350,0 0,350" fill="#ffb74d" opacity="0.9" />
        <polygon points="0,0 300,0 0,300" fill="#d32f2f" opacity="0.85" />

        <polygon points="1000,707 600,707 1000,307" fill="#ffb74d" />
        <polygon points="1000,707 650,707 1000,357" fill="#ff9800" opacity="0.9" />
        <polygon points="1000,707 700,707 1000,407" fill="#d32f2f" opacity="0.85" />
      </svg>

      <!-- CONTEÚDO ESQUERDO -->
      <div class="content-left">
        <h2>CONTEÚDO PROGRAMÁTICO :</h2>
        <strong>Prevenção e combate ao princípio de incêndio: Conteúdo teórico e prático</strong>

        <ul>
          <li>Objetivos e atribuições da brigada de incêndio e emergência;</li>
          <li>Teoria do fogo: reação em cadeia, elementos, ignição e combustão;</li>
          <li>Formas de propagação do fogo: condução, irradiação e convecção;</li>
          <li>Classes de incêndio e suas características;</li>
          <li>Métodos de extinção: resfriamento, isolamento e abafamento;</li>
          <li>Agentes extintores: água, PQS, CO2, classe K;</li>
          <li>Equipamentos de combate a incêndio;</li>
          <li>Combate a incêndios em cozinhas industriais;</li>
          <li>EPI’s e equipamentos de emergência;</li>
          <li>Abandono de área e controle de pânico;</li>
          <li>Atendimento a pessoas com mobilidade reduzida.</li>
        </ul>

        <h3>Primeiros Socorros : Conteúdo teórico e prático</h3>
        <ul>
          <li>Avaliação inicial do cenário;</li>
          <li>Análise de vítimas;</li>
          <li>OVACE;</li>
          <li>RCP;</li>
          <li>Estado de choque;</li>
          <li>Hemorragias;</li>
          <li>Fraturas;</li>
          <li>Queimaduras;</li>
          <li>Manipulação e transporte de vítimas.</li>
        </ul>

        <strong>CARGA HORÁRIA TOTAL : 08 HORAS</strong>
      </div>

      <!-- CONTEÚDO DIREITO -->
      <div class="content-right">
        <img src=${data.logoSrc} class="logo" />

        <div class="box">
          <strong>PRESERVAR Serviços e Treinamentos</strong>
          37.075.049/0001-13<br />
          Registro Nº 001/2026<br />
          Folha 001/2026<br />
          Livro PTS 001/2026
        </div>

        <div class="box">
          <strong>Certificado emitido conforme</strong>
          NR-23<br />
          NBR 14.276/2020<br />
          NT 17 CBMMA
        </div>

        <div class="box small-text">
          Este certificado tem validade para prova de títulos, fins curriculares e demais utilidades, na qualidade para o curso de BRIGADISTA, respeitando-se os conteúdos e carga horária conforme NBR 14.276/2020 e NT 17 CBMMA, não podendo ser utilizado para outros fins.
        </div>
      </div>

    </div>
  </body>
</html>`;
}
