import { CertificateTypeLabels, CertificateType } from '@/src/core/enums/certificate-type.enum';
import { imageToBase64 } from '@/src/lib/image-to-base64';
import path from 'path';

export interface CertificateContent {
  frontDescription: (studentName: string, cpf: string, date: string, hours: number) => string;
  programmaticContent: string;
  legalTextRight?: string;
  validityText?: string;
  signature1Image: string;
  signature2Image: string;
  signature1Text: string;
  signature2Text: string;
  name: string;
}

// ─── Assinaturas reutilizáveis ────────────────────────────────────────────────

const signature1_RodrigoMarcio = `
  <div>
    <div class="line"></div>
    <strong>COORDENADOR RESPONSÁVEL</strong>
    Rodrigo Márcio Silva de Oliveira<br />
    Engenheiro de Segurança do Trabalho<br />
    Credenciamento CBMMA 991413/092023
  </div>
`;

const signature2_LourivalNeto = `
  <div>
    <div class="line"></div>
    <strong>INSTRUTOR PCI E APH</strong>
    Lourival Taveira Lobão Neto<br />
    Bombeiro Industrial Civil<br />
    Credenciamento CBMMA 440229/092023
  </div>
`;

const signature1_LourivalTransito = `
  <div>
    <div class="line"></div>
    Lourival T. Lobão Neto<br />
    Instrutor e Examinador de Trânsito<br />
    Certificado No. AIT2023201301/2023<br />
    Instrutor 4X4, Veículos Pesados<br />
    Instrutor Munck<br />
    Instrutor de Máquina e Equipamentos Pesados<br />
    Resgate e Salvamento Veicular
  </div>
`;

const signature2_LucianaValeska = `
  <div>
    <div class="line"></div>
    Luciana Valeska Baldez Braga<br />
    <strong>DIRETORA TÉCNICA</strong><br />
    CRA/MA No. 4788
  </div>
`;

// ─── Imagens de assinatura ────────────────────────────────────────────────────

const sig1Image = imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_1.png'));
const sig2Image = imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_2.png'));

const sigLucianaImage = imageToBase64(path.join(process.cwd(), 'src/app/assets/assinatura_luciana.png'));

// ─── Mapa de certificados ─────────────────────────────────────────────────────

export const certificateContents: Record<CertificateType, CertificateContent> = {

  // ── #1 · CIPEIRO ────────────────────────────────────────────────────────────
  CIPEIRO: {
    name: 'Curso de Formação para Cipeiros',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>, em conformidade com a Lei 6.514 de 22 de dezembro de 1977,
      regulamentada pelo Decreto 3.214 de 08/06/1978, e desta Normas Regulamentadoras NR 5
      completou o <strong>Curso de Formação para Cipeiros</strong> no período
      de <strong>${date}</strong>, com a carga horária total de <strong>${hours} horas/aula</strong>.
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
        <li>Medidas de Controle de Riscos; Hierarquia de controle (eliminação, substituição, EPC, EPI);</li>
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
    validityText:
      'Este certificado tem validade para prova de títulos, fins curriculares e demais utilidades, na qualidade para o curso de Formação de Cipeiros, respeitando-se os conteúdos e carga horária, conforme Decreto 3.214 de 08/06/1978, não podendo ser utilizado para outros fins.',
    signature1Text: signature1_RodrigoMarcio,
    signature2Text: signature2_LourivalNeto,
    signature1Image: sig1Image,
    signature2Image: sig2Image,
  },

  // ── #2 · DIREÇÃO DEFENSIVA (versão urbana/rural — Picos-PI) ─────────────────
  DIRECAO_DEFENSIVA: {
    name: 'Treinamento de Direção Defensiva e Preventiva',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>.
      Participou com aproveitamento satisfatório do <strong>Treinamento de Direção Defensiva e Preventiva</strong>
      com 04 horas teóricas e 04 horas práticas no período de <strong>${date}</strong>,
      em Picos-PI, totalizando a carga horária de <strong>${hours} horas</strong>.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <strong class="sub-title">Módulo I — Teórico</strong>
      <ul>
        <li>Conceito de Direção Defensiva e Preventiva e sua aplicação;</li>
        <li>Como dirigir preventivamente;</li>
        <li>Acidentes e Estatísticas;</li>
        <li>As Principais Causas dos Acidentes;</li>
        <li>Direção em vias urbanas e rurais (lei da preferência de passagem e sinalizações de trânsito);</li>
        <li>Distância de Segurança x Espaço de Frenagem;</li>
        <li>Dinâmica de Transferência de Peso x Estabilidade do Veículo;</li>
        <li>Previsibilidade de Risco / Reação Antecipada a Possíveis Erros dos Outros Motoristas;</li>
        <li>Comportamento seguro no trânsito;</li>
        <li>O uso do cinto de segurança: entendendo a sua importância.</li>
      </ul>
      <strong class="sub-title">Módulo II — Teórico</strong>
      <ul>
        <li>A lei 14.599/23 e as novas atualizações no Código de Trânsito Brasileiro;</li>
        <li>Uso do Álcool, Medicamentos e Drogas x Acidentes — LEI 11.705;</li>
        <li>Os Crimes de Trânsito: Tipos e aplicabilidade das sanções penais;</li>
        <li>Como Administrar um Conflito no Trânsito;</li>
        <li>Como evitar Colisões Frontal / Traseira / Lateral;</li>
        <li>Manutenção Correta / Preventiva, Checagem Operacional Inicial do Veículo;</li>
        <li>Posicionamento Correto Dentro do Veículo x Regulagens de Bancos e Equipamentos;</li>
        <li>Funções e aplicações do sistema de Freio ABS;</li>
        <li>Funções e aplicações do Air Bag;</li>
        <li>Funções e aplicações do ESB — Controle de Estabilidade do Veículo.</li>
      </ul>
      <strong class="sub-title">Módulo III — Prática de Direção Veicular</strong>
      <ul>
        <li>Controle do volante durante a direção veicular;</li>
        <li>Manobras de desvios de obstáculos e retomada correta da trajetória;</li>
        <li>Frenagens de emergência;</li>
        <li>Direção em vias urbanas e rurais (comportamento seguro e preventivo).</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
    `,

    signature1Text: signature1_LourivalTransito,
    signature2Text: signature2_LucianaValeska,
    signature1Image: sig2Image,
    signature2Image: sigLucianaImage,
  },

  // ── #3 · NR-06 — USO DE EPI (Inflamáveis/Combustíveis) ─────────────────────
  NR06_EPI: {
    name: 'NR – 06 Uso de Equipamentos de Proteção Individual',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>, participou do treinamento de
      <strong>NR – 06 Uso de Equipamentos de Proteção Individual</strong>
      no dia <strong>${date}</strong>, com carga horária de <strong>${hours}h</strong>,
      conforme item 12 do Anexo IV da NR-20 (Atividades e Operações com Inflamáveis Líquidos e Combustíveis),
      tendo seu aproveitamento satisfatório.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <p>Na NR-20, o Anexo IV (Atividades e Operações com Inflamáveis Líquidos e Combustíveis) traz,
      no item 12, a exigência de uso de Equipamentos de Proteção Individual (EPIs) adequados aos riscos.</p>
      <ul>
        <li>Sensibilização/motivação para o uso de EPIs;</li>
        <li>Conceito de EPI;</li>
        <li>Classificação dos EPIs;</li>
        <li>Aspectos Legais;</li>
        <li>Certificado de Aprovação – CA;</li>
        <li>Obrigações;</li>
        <li>Adequação do EPI ao trabalho;</li>
        <li>Competência;</li>
        <li>Guarda, Restauração, Lavagem e Higienização;</li>
        <li>Fiscalização;</li>
        <li>Proteção para cabeça: capacete de segurança quando houver risco de impacto ou queda de objetos;</li>
        <li>Proteção ocular e facial: óculos de segurança ou protetor facial contra respingos de combustíveis;</li>
        <li>Proteção das mãos: luvas resistentes a agentes químicos (como hidrocarbonetos);</li>
        <li>Proteção dos pés: calçados de segurança com solado antiderrapante e resistência a produtos químicos;</li>
        <li>Proteção do corpo: vestimentas adequadas, podendo incluir roupas antiestáticas ou resistentes a chamas;</li>
        <li>Proteção respiratória: quando houver vapores ou atmosferas potencialmente perigosas (conforme avaliação de risco);</li>
        <li>Proteção auditiva: se houver exposição a níveis elevados de ruído no ambiente.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 04 HORAS</strong>
    `,
    legalTextRight: 'Item 12 do Anexo IV da NR-20',
    validityText:
      'Este certificado tem validade para prova de títulos, fins curriculares e demais utilidades, na qualidade para o curso de NR-06 Uso de EPI, respeitando-se os conteúdos e carga horária, conforme item 12 do Anexo IV da NR-20, não podendo ser utilizado para outros fins.',
    signature1Text: signature1_RodrigoMarcio,
    signature2Text: signature2_LourivalNeto,
    signature1Image: sig1Image,
    signature2Image: sig2Image,
  },

  // ── #4 · BENZENO — Exposição Ocupacional (NR-20 Anexo IV) ───────────────────
  BENZENO_NR20: {
    name: 'Exposição Ocupacional ao Benzeno em Postos de Serviços Revendedores de Combustíveis Automotivos',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>, participou do treinamento de
      <strong>Exposição Ocupacional ao Benzeno em Postos de Serviços Revendedores de Combustíveis Automotivos</strong>,
      conforme Anexo IV da NR-20, no dia <strong>${date}</strong>,
      com carga horária de <strong>${hours}h</strong>, conforme Item 5.0 Anexo IV da NR-20,
      tendo seu aproveitamento satisfatório.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <ul>
        <li>Riscos de exposição ao benzeno e vias de absorção;</li>
        <li>Conceitos básicos sobre monitoramento ambiental, biológico e de saúde;</li>
        <li>Sinais e sintomas de intoxicação ocupacional por benzeno;</li>
        <li>Medidas de prevenção;</li>
        <li>Procedimentos de emergência;</li>
        <li>Caracterização básica das instalações, atividades de risco e pontos de possíveis emissões de benzeno;</li>
        <li>Dispositivos legais sobre o benzeno.</li>
      </ul>
      <p>Das situações de risco de exposição ao benzeno e as medidas de prevenção nas atividades de maior risco:</p>
      <ul>
        <li>Conferência do produto no caminhão-tanque no ato do descarregamento;</li>
        <li>Coleta de amostras no caminhão-tanque com amostrador específico;</li>
        <li>Medição volumétrica de tanque subterrâneo com régua;</li>
        <li>Estacionamento do caminhão, aterramento e conexão via mangotes aos tanques subterrâneos;</li>
        <li>Descarregamento de combustíveis para os tanques subterrâneos;</li>
        <li>Desconexão dos mangotes e retirada do conteúdo residual;</li>
        <li>Abastecimento de combustível para veículos;</li>
        <li>Abastecimento de combustíveis em recipientes certificados;</li>
        <li>Análises físico-químicas para o controle de qualidade dos produtos comercializados;</li>
        <li>Limpeza de válvulas, bombas e seus compartimentos de contenção de vazamentos;</li>
        <li>Esgotamento e limpeza de caixas separadoras.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 04 HORAS</strong>
    `,
    legalTextRight: 'Item 5.0 Anexo IV da NR-20',
    validityText:
      'Este certificado tem validade para prova de títulos, fins curriculares e demais utilidades, na qualidade para o curso de Exposição Ocupacional ao Benzeno, respeitando-se os conteúdos e carga horária, conforme Item 5.0 Anexo IV da NR-20, não podendo ser utilizado para outros fins.',
    signature1Text: signature1_RodrigoMarcio,
    signature2Text: signature2_LourivalNeto,
    signature1Image: sig1Image,
    signature2Image: sig2Image,
  },

  // ── #5 · DIREÇÃO 4×4 — Áreas Remotas (Bacabal-MA) ──────────────────────────
  DIRECAO_4X4: {
    name: 'Treinamento de Direção Defensiva e Operacional para Veículos 4×4 em Áreas Remotas',
    frontDescription: (studentName, cpf, date, hours) => `
      RENACH No. XXXXXXXXX, categoria xx, CI: XXXXX, CPF: <strong>${cpf}</strong>.
      Participou com aproveitamento satisfatório do
      <strong>Treinamento de Direção Defensiva e Operacional para Veículos 4×4 em Áreas Remotas</strong>
      com 04 horas teóricas e 04 horas práticas no período de <strong>${date}</strong>,
      em Bacabal-MA, totalizando a carga horária de <strong>${hours} horas</strong>.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <strong class="sub-title">Módulo I — Teórico</strong>
      <ul>
        <li>Conceito de Direção Defensiva e Preventiva e sua aplicação;</li>
        <li>Como dirigir preventivamente;</li>
        <li>O comportamento seguro no trânsito;</li>
        <li>As principais causas dos acidentes na operação do 4×4;</li>
        <li>Distância de Segurança x Espaço de Frenagem (ABS);</li>
        <li>Dinâmica de Transferência de Peso x Estabilidade do Veículo;</li>
        <li>Previsibilidade de Risco / Reação Antecipada a Possíveis Erros dos Outros Motoristas;</li>
        <li>O uso do cinto de segurança: entendendo a sua importância;</li>
        <li>Entendendo os sistemas do veículo: Motor, Transmissão, Suspensão, Arrefecimento, Direção, Freios e Sistema Elétrico;</li>
        <li>Avaliação prévia do cenário para evitar atoleiros e quebras do 4×4;</li>
        <li>Acionamento do sistema de tração: H4, redução L4 e bloqueio do diferencial traseiro;</li>
        <li>A importância do Check List: Checagem Operacional Inicial do Veículo;</li>
        <li>Panes: os principais tipos, sinais que o veículo apresenta e como interpretá-los;</li>
        <li>A condução em locais de difícil acesso; dinâmica de transferência de torque; como evitar o superaquecimento do sistema de tração;</li>
        <li>A manutenção preventiva e lubrificação do 4×4.</li>
      </ul>
      <strong class="sub-title">Módulo II — Prática de Direção 4×4</strong>
      <ul>
        <li>Avaliação prévia do cenário para evitar atoleiros e quebras do 4×4;</li>
        <li>Acionamento correto da tração H4, Redução L4 e Bloqueio do Diferencial Traseiro em áreas remotas;</li>
        <li>Manobras de desvios de obstáculos e retomada correta da trajetória;</li>
        <li>Frenagens de emergência.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
    `,
    signature1Text: signature1_LourivalTransito,
    signature2Text: signature2_LucianaValeska,
    signature1Image: sig2Image,
    signature2Image: sigLucianaImage,
  },

  // ── Brigadista (mantido do template original) ────────────────────────────────
  BRIGADISTA: {
    name: 'Brigada de Incêndio e Emergência',
    frontDescription: (studentName, cpf, date, hours) => `
      CPF: <strong>${cpf}</strong>, participou do treinamento de
      <strong>${CertificateTypeLabels[CertificateType.BRIGADISTA]}</strong>,
      no dia <strong>${date}</strong>, com carga horária de <strong>${hours}h</strong>,
      conforme <strong>NR 23, NBR 14.276/2020 e NT-17 CBMMA</strong>,
      tendo seu aproveitamento satisfatório.
    `,
    programmaticContent: `
      <h2>CONTEÚDO PROGRAMÁTICO :</h2>
      <strong class="sub-title">Prevenção e combate ao princípio de incêndio: Conteúdo teórico e prático</strong>
      <ul>
        <li>Objetivos e atribuições da brigada de incêndio e emergência;</li>
        <li>Teoria do fogo: reação em cadeia, elementos, funções, pontos de fulgor, ignição e combustão;</li>
        <li>Formas de propagação do fogo: condução, irradiação e convecção;</li>
        <li>Classes de incêndio e suas características;</li>
        <li>Prevenção do Incêndio: técnicas de prevenção;</li>
        <li>Métodos de extinção: resfriamento, isolamento, abafamento;</li>
        <li>Equipamentos de combate a incêndio: extintores, hidrantes, mangueiras e acessórios;</li>
        <li>Combate a incêndios em cozinhas industriais, equipamentos e formas de utilização e combate;</li>
        <li>EPIs — Equipamento de Proteção Individual, sua importância e utilidade;</li>
        <li>Equipamentos de detecção, alarme, luz de emergência e comunicações;</li>
        <li>Abandono de área: técnicas de saída organizada, pontos de encontro, chamada e controle de pânico;</li>
        <li>Atendimento a pessoas com mobilidade reduzida: formas de abordagem durante o atendimento à emergência.</li>
      </ul>
      <h3>Primeiros Socorros: Conteúdo teórico e prático</h3>
      <ul>
        <li>Avaliação inicial do cenário;</li>
        <li>Análise de vítimas, avaliações primária e secundária;</li>
        <li>Obstrução de vias aéreas por corpos estranhos (OVACE);</li>
        <li>RCP – Reanimação Cardiopulmonar;</li>
        <li>Estado de choque, crises emocionais: classificação, avaliação dos sinais e técnicas de prevenção e tratamento;</li>
        <li>Hemorragias: Tipos, Classificação e tratamento;</li>
        <li>Fraturas: Tipos, Classificação e tratamento;</li>
        <li>Queimaduras: Tipos, Classificação e tratamento;</li>
        <li>Manipulação e transporte de vítimas.</li>
      </ul>
      <strong class="workload">CARGA HORÁRIA TOTAL : 08 HORAS</strong>
    `,
    legalTextRight: 'NR-23 NBR 14.276/2020 NT 17 CBMMA',
    validityText: 'Este certificado tem validade para prova de títulos,fins curriculares e demais utilidades,na qualidade para o curso de BRIGADISTA,respeitando-se os conteúdos e carga horária, conforme NBR 14.276/2020 e NT17 parte 1 CBMMA, não podendo ser utilizado para outros fins.',
    signature1Text: signature1_RodrigoMarcio,
    signature2Text: signature2_LourivalNeto,
    signature1Image: sig1Image,
    signature2Image: sig2Image,
  },

};