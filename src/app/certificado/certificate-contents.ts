import { CertificateTypeLabels, CertificateType } from '@/src/core/enums/certificate-type.enum';
import { imageToBase64 } from '@/src/lib/image-to-base64';
import path from 'path';

export interface CertificateContent {
  frontDescription: (studentName: string, cpf: string, date: string, hours: number) => string;
  programmaticContent: string;
  legalTextRight: string;
  validityText: string;
  signature1Image: string;
  signature2Image: string;
  signature1Text: string;
  signature2Text: string;
  name: string;
}

const genericTemplate: CertificateContent = {
  name: 'Genérico',
  frontDescription: (studentName, cpf, date, hours) => `
    CPF: <strong>${cpf}</strong>, participou do treinamento de <strong>${CertificateTypeLabels[CertificateType.GENERICO_1]}</strong>, no dia <strong>${date}</strong>, com carga horária de <strong>${hours}h</strong>, tendo seu aproveitamento satisfatório.
  `,
  programmaticContent: `
    <h2>CONTEÚDO PROGRAMÁTICO :</h2>
    <ul>
      <li>Conteúdo geral do curso.</li>
    </ul>
    <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
  `,
  legalTextRight: 'Conforme legislação vigente',
  validityText: 'Este certificado tem validade para prova de títulos, fins curriculares e demais utilidades.',
  signature1Text: `
    <div>
      <div class="line"></div>
      <strong>COORDENADOR RESPONSÁVEL</strong>
      Rodrigo Márcio Silva de Oliveira<br />
      Engenheiro de Segurança do Trabalho<br />
      Credenciamento CBMMA 991413/092023
    </div>
  `,
  signature2Text: `
    <div>
      <div class="line"></div>
      <strong>INSTRUTOR</strong>
      Lourival Taveira Lobão Neto<br />
      Bombeiro Industrial Civil<br />
      Credenciamento CBMMA 440229/092023
    </div>
  `,
  signature1Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_1.png')),
  signature2Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_2.png')),
};

export const certificateContents: Record<CertificateType, CertificateContent> = {
  BRIGADISTA: {
    name: 'Brigadista',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>, participou do treinamento de <strong>${CertificateTypeLabels[CertificateType.BRIGADISTA]}</strong>, no dia <strong>${date}</strong>, com carga horária de <strong>${hours}h</strong>, conforme <strong>NR 23, NBR 14.276/2020 e NT-17 CBMMA</strong>, tendo seu o aproveitamento satisfatório.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <strong class="sub-title">Prevenção e combate ao princípio de incêndio: Conteúdo teórico e prático</strong>
      <ul>
        <li>Objetivos e atribuições da brigada de incêndio e emergência;</li>
        <li>Teoria do fogo:reação em cadeia elementos, funções, pontos de fulgor, ignição e combustão;</li>
        <li>Formas de propagação do fogo: condução, irradiação e convecção;</li>
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
        <li>Manipulação e transporte de vítimas;</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
    `,
    legalTextRight: 'NR-23 NBR 14.276/2020 NT 17 CBMMA',
    validityText: 'Este certificado tem validade para prova de títulos,fins curriculares e demais utilidades,na qualidade para o curso de BRIGADISTA,respeitando-se os conteúdos e carga horária, conforme NBR 14.276/2020 e NT17 parte 1 CBMMA, não podendo ser utilizado para outros fins.',
    signature1Text: `
      <div>
        <div class="line"></div>
        <strong>COORDENADOR RESPONSÁVEL</strong>
        Rodrigo Márcio Silva de Oliveira<br />
        Engenheiro de Segurança do Trabalho<br />
        Credenciamento CBMMA 991413/092023
      </div>
    `,
    signature2Text: `
      <div>
        <div class="line"></div>
        <strong>INSTRUTOR PCI E APH</strong>
        Lourival Taveira Lobão Neto<br />
        Bombeiro Industrial Civil<br />
        Credenciamento CBMMA 440229/092023
      </div>
    `,
    signature1Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_1.png')),
    signature2Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_2.png')),
  },
  CIPEIRO: {
    name: 'Cipeiro',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF : <strong>${cpf}</strong>, em conformidade com a Lei 6.514 de 22 de dezembro de 1977, regulamentada pelo Decreto 3.214 de 08/06/1978, e desta Normas Regulamentadoras NR 5 completou o <strong>${CertificateTypeLabels[CertificateType.CIPEIRO]}</strong> no período de <strong>${date}</strong>, com a carga horária total de <strong>${hours} horas/aula</strong>.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <ul>
        <li>Introdução à Segurança do Trabalho; Conceitos básicos de segurança e saúde no trabalho;</li>
        <li>Importância da prevenção de acidentes; Panorama de acidentes de trabalho no Brasil;</li>
        <li>Legislação de Segurança e Saúde; Estrutura das Normas Regulamentadoras (NRs);</li>
        <li>Direitos e deveres de empregados e empregadores; Responsabilidades da CIPA conforme a NR-5;</li>
        <li>Organização e Funcionamento da CIPA; Objetivos da CIPA; Composição e mandato;</li>
        <li>Atribuições dos membros; Reuniões ordinárias e extraordinárias; Elaboração do calendário anual;</li>
        <li>Identificação de Riscos; Tipos de riscos ocupacionais: Físicos; Químicos; Biológicos; Ergonômicos; Acidentes (mecânicos);</li>
        <li>Introdução ao Mapa de Riscos; Investigação e Análise de Acidentes: Conceito de acidente e incidente;</li>
        <li>Causas imediatas e causas básicas: Métodos simples de investigação; Medidas corretivas e preventivas;</li>
        <li>Medidas de Controle de Riscos Hierarquia de controle (eliminação, substituição, EPC, EPI);</li>
        <li>Uso correto de Equipamentos de Proteção Individual (EPI); Equipamentos de Proteção Coletiva (EPC);</li>
        <li>Noções de Primeiros Socorros; Atendimento inicial em emergências;</li>
        <li>Situações comuns (quedas, cortes, queimaduras); Acionamento de serviços de emergência;</li>
        <li>Prevenção e Combate a Incêndios: Classes de incêndio; Tipos de extintores; Procedimentos em caso de incêndio; Plano de evacuação;</li>
        <li>Saúde no Trabalho; Doenças ocupacionais; Ergonomia no ambiente de trabalho; Saúde mental e qualidade de vida;</li>
        <li>SIPAT (Semana Interna de Prevenção de Acidentes); Objetivos da SIPAT; Planejamento e organização; Ações educativas e campanhas;</li>
        <li>Comunicação e Treinamento; Técnicas de comunicação em segurança; Diálogo Diário de Segurança (DDS); Conscientização dos colaboradores.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 16 HORAS</strong>
    `,
    legalTextRight: 'Decreto 3.214 de 08/06/1978',
    validityText: 'Este certificado tem validade para prova de títulos,fins curriculares e demais utilidades,na qualidade para o curso de Formação de Cipeiros,respeitando-se os conteúdos e carga horária, conforme Decreto 3.214 de 08/06/1978, não podendo ser utilizado para outros fins.',
    signature1Text: `
      <div>
        <div class="line"></div>
        <strong>COORDENADOR RESPONSÁVEL</strong>
        Rodrigo Márcio Silva de Oliveira<br />
        Engenheiro de Segurança do Trabalho<br />
        Credenciamento CBMMA 991413/092023
      </div>
    `,
    signature2Text: `
      <div>
        <div class="line"></div>
        <strong>INSTRUTOR PCI E APH</strong>
        Lourival Taveira Lobão Neto<br />
        Bombeiro Industrial Civil<br />
        Credenciamento CBMMA 440229/092023
      </div>
    `,
    signature1Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_1.png')),
    signature2Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_2.png')),
  },
  DIRECAO_DEFENSIVA: {
    name: 'Direção Defensiva',
    frontDescription: (studentName, cpf, date, hours) => `
      RENACH No. XXXXXXXXX, categoria xx, CI : XXXXX, CPF : <strong>${cpf}</strong>. Participou com aproveitamento satisfatório do <strong>Treinamento de Direção Defensiva e Operacional para Veículos 4 x 4 em Áreas Remotas</strong> com 04 horas teóricas e 04 horas práticas no período de <strong>${date}</strong>, em Bacabal-MA, totalizando a carga horária de <strong>${hours} horas</strong>.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <ul>
        <li>Introdução à Direção Defensiva;</li>
        <li>Condições adversas;</li>
        <li>Manutenção preventiva;</li>
        <li>Condução em áreas remotas e off-road;</li>
        <li>Procedimentos de emergência;</li>
        <li>Legislação de trânsito atualizada.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
    `,
    legalTextRight: 'CTB - Código de Trânsito Brasileiro',
    validityText: 'Este certificado tem validade para comprovação de treinamento, fins curriculares e demais utilidades na qualidade de treinamento de Direção Defensiva, não podendo ser utilizado para outros fins.',
    signature1Text: `
      <div>
        <div class="line"></div>
        <strong>COORDENADOR RESPONSÁVEL</strong>
        Rodrigo Márcio Silva de Oliveira<br />
        Engenheiro de Segurança do Trabalho<br />
        Credenciamento CBMMA 991413/092023
      </div>
    `,
    signature2Text: `
      <div>
        <div class="line"></div>
        <strong>INSTRUTOR PCI E APH</strong>
        Lourival Taveira Lobão Neto<br />
        Bombeiro Industrial Civil<br />
        Credenciamento CBMMA 440229/092023
      </div>
    `,
    signature1Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_1.png')),
    signature2Image: imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_2.png')),
  },
  GENERICO_1: genericTemplate,
};
