'use client';

interface CertificateProps {
  studentName: string;
  cpf: string;
  courseName: string;
  date: string;
  hours: number;
}

import Image from 'next/image';
import logo from '../assets/logo.png';
import selo from '../assets/selo.png';

export function CertifyTemplate({
  studentName,
  cpf,
  courseName,
  date,
  hours,
}: CertificateProps) {
  return (
    <html>
      <head>
        <style>{`
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
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #f5f5f5;
          }

          .page {
            position: relative;
            
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            color: black;
          }

          /* BORDA DOURADA */
          .page::before {
            content: '';
            position: absolute;
            top: 5mm;
            left: 10mm;
            right: 10mm;
            bottom: 20mm;
            border: 3px solid #d4af37;
            pointer-events: none;
            z-index: 10;
            
          }

          /* DECORAÇÕES DE FUNDO */
          .decorations {
            position: absolute;
            inset: 0;
            z-index: 0;
            overflow: hidden;
          }

          /* CONTEÚDO */
          .content {
            position: relative;
            z-index: 5;
            text-align: center;
            height:82%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-top: 20mm;

          }

          h1 {
            font-size: 72px;
            color: #b71c1c;
            letter-spacing: 8px;
            margin-top: 0;
            margin-bottom: 8mm;
            font-weight: bold;
            font-style: italic;
          }

          .subtitle {
            font-size: 20px;
            color: #b71c1c;
            margin-bottom: 16mm;
          }

          .student-name {
            font-size: 32px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5mm;
            letter-spacing: 6px;
          }

          .divider {
            width: 58%;
            height: 2px;
            background: #b71c1c;
            margin: 0 auto 12mm auto;
          }

          .description {
            font-size: 15px;
            line-height: 1.9;
            padding: 0 60mm;
          }

          .description strong {
            font-weight: 600;
          }

          /* LOGO */
          .logo {
            position: absolute;
            top: 15mm;
            right: 35mm;
            width: 95px;
            z-index: 20;
          }

          .logo-text {
            position: absolute;
            top: 47mm;
            right: 32mm;
            text-align: center;
            z-index: 20;
            width: 96px;
          }

          .logo-text-main {
            font-size: 11px;
            font-weight: bold;
            color: black;
            letter-spacing: 1px;
          }

          .logo-text-sub {
            font-size: 7px;
            font-weight: 600;
            color: black;
            letter-spacing: 1.2px;
          }

          /* RODAPÉ */
          .footer {
            position: absolute;
            bottom: 25mm;
            left: 35mm;
            right: 35mm;
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            z-index: 10;
            margin-left: -120px;
            width:800px;
            align-items: center
          }

          .signature {
            text-align: center;
            font-size: 10px;
            line-height: 1.4;
            color: black;
            display:flex;
            justify-content:center;
            align-items:center;

          }

          .signature .line {
            width: 180px;
            border-top: 1px solid #000;
            margin: 0 auto 6px auto;
          }

          .signature strong {
            font-weight: bold;
            display: block;
            margin-bottom: 2px;
          }

          .seal {
            width: 120px;
            height: 120px;
            margin: 0 30px;
            margin-bottom: 8px;
          }
        `}</style>
      </head>

      <body>
        <div className="page">
          {/* DECORAÇÕES EM SVG - CANTO SUPERIOR ESQUERDO */}
          <svg className="decorations" viewBox="0 0 1000 707" preserveAspectRatio="none">
            {/* Canto superior esquerdo */}
            <polygon points="0,0 420,0 0,420" fill="#f57c00" />
            <polygon points="0,0 380,0 0,380" fill="#ffb74d" opacity="0.95" />
            <polygon points="0,0 340,0 0,340" fill="#ff9800" opacity="0.9" />
            <polygon points="0,0 280,0 0,280" fill="#d32f2f" opacity="0.85" />

            {/* Linhas brancas decorativas superior esquerdo */}
            <line x1="0" y1="220" x2="220" y2="0" stroke="white" strokeWidth="8" opacity="0.6" />
            <line x1="0" y1="280" x2="150" y2="130" stroke="white" strokeWidth="6" opacity="0.5" />
            <polygon points="0,240 60,180 0,180" fill="white" opacity="0.4" />

            {/* Canto inferior direito */}
            <polygon points="1000,707 580,707 1000,287" fill="#ffb74d" />
            <polygon points="1000,707 620,707 1000,327" fill="#ff9800" opacity="0.95" />
            <polygon points="1000,707 680,707 1000,387" fill="#d32f2f" opacity="0.9" />
            <polygon points="1000,707 740,707 1000,447" fill="#f57c00" opacity="0.85" />

            {/* Retângulo rotacionado canto inferior direito */}
            <rect x="880" y="600" width="80" height="100" fill="#ff6f00" opacity="0.7" transform="rotate(45 920 650)" />

            {/* Linhas brancas decorativas inferior direito */}
            <line x1="1000" y1="487" x2="780" y2="707" stroke="white" strokeWidth="8" opacity="0.6" />
            <line x1="1000" y1="427" x2="850" y2="577" stroke="white" strokeWidth="6" opacity="0.5" />
          </svg>

          {/* LOGO PRESERVAR */}
          <Image src={logo} className="logo" alt="Logo Preservar" />

          {/* CONTEÚDO PRINCIPAL */}
          <div className="content">
            <h1>CERTIFICADO</h1>
            <p className="subtitle">Certificamos que</p>

            <p className="student-name">{studentName}</p>
            <div className="divider" />

            <div className="description">
              <p>
                que sob o CPF: <strong>{cpf}</strong>, participou com êxito do Treinamento
              </p>
              <p>
                de <strong>{courseName}</strong>, realizado no dia <strong>{date}</strong>, com
              </p>
              <p>
                carga horária de <strong>{hours}h</strong>, conforme <strong>NR</strong>
              </p>
              <p>
                <strong>23, NBR 14276, NBR 13434</strong> e <strong>IT - 17 do CBMMA</strong>.
              </p>
            </div>
          </div>

          {/* RODAPÉ COM ASSINATURAS */}
          <div className="footer">

            <div className="signature">
              <Image src={selo} className="seal" alt="Selo Best Quality" />

              <div>
                <div className="line" />
                <strong>COORDENADOR RESPONSÁVEL</strong>
                Rodrigo Márcio Silva de Oliveira
                <br />
                Engenheiro de Segurança do Trabalho
                <br />
                Credenciamento CBMMA 991413/092023
              </div>
            </div>



            <div className="signature">
              <div>
                <div className="line" />
                <strong>INSTRUTOR PCI E APH</strong>
                Lourival Taveira Lobão Neto
                <br />
                Bombeiro Industrial Civil
                <br />
                Credenciamento CBMMA 440229/092023
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}