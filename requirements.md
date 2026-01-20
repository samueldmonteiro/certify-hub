#### Requisitos Funcionais (RF)
##### Autenticação e Usuário

- [x] RF01 – Deve ser possível o administrador se autenticar no sistema.

- [x] RF02 – Deve ser possível obter o perfil do usuário autenticado.

- [x] RF03 – Deve ser possível realizar logout do sistema.

- [x] RF04 – Deve ser possível exibir o painel administrativo após autenticação bem-sucedida.

##### Gestão de Certificados

- [x] RF05 – Deve ser possível realizar o upload de uma planilha Excel para geração de certificados.

- [x] RF06 – Deve ser possível validar se a planilha enviada contém os campos obrigatórios esperados.

- [x] RF07 – Deve ser possível extrair os dados da planilha enviada.

- [x] RF08 – Deve ser possível listar os dados dos alunos extraídos da planilha antes da geração dos certificados.

- [x] RF09 – Deve ser possível gerar certificados automaticamente a partir dos dados da planilha.

- [x] RF10 – Deve ser possível gerar um certificado individual a partir de uma inscrição única de aluno.

- [x] RF11 – Deve ser possível preencher automaticamente nome, CPF e demais dados no certificado.

- [x] RF12 – Deve ser possível utilizar um template visual de certificado previamente definido.

- [x] RF13 – Deve ser possível gerar um único arquivo PDF contendo todos os certificados gerados.

- [x] RF14 – Deve ser possível visualizar ou baixar o PDF gerado.

- [x] RF15 – Deve ser possível reutilizar o mesmo template para múltiplas gerações.

#### Requisitos Não Funcionais (RNF)
##### Segurança

- [x] RNF01 – As senhas dos usuários devem ser armazenadas de forma criptografada.

- [x] RNF02 – O acesso ao sistema deve ser protegido por sessão ou token seguro (JWT).

- [x] RNF03 – Apenas usuários autenticados podem acessar o painel administrativo.

- [x] RNF04 – Apenas usuários autenticados podem gerar certificados.

##### Performance e Escalabilidade

- [x] RNF05 – O sistema deve processar planilhas com até X alunos sem degradação perceptível de desempenho.

- [x] RNF06 – A geração do PDF deve ocorrer em tempo aceitável para o usuário.

- [x] RNF07 – O sistema deve lidar corretamente com falhas durante o processamento da planilha ou geração do PDF.

##### Usabilidade

- [x] RNF08 – O sistema deve fornecer mensagens claras de erro em caso de planilha inválida.

- [x] RNF09 – O sistema deve indicar o progresso da geração dos certificados quando aplicável.

#### Regras de Negócio (RN)

- [x] RN01 – Cada certificado deve possuir um número identificador único no formato XXX/AAAA (ex: 015/2026).

- [x] RN02 – Cada certificado deve conter a informação da página no formato PP/AAAA (ex: 03/2026).

- [x] RN03 – A cada 50 certificados gerados, o número da página deve ser incrementado automaticamente.

- [x] RN04 – O ano (AAAA) deve corresponder ao ano corrente no momento da geração.

- [x] RN05 – Certificados só podem ser gerados a partir de dados válidos (planilha validada ou inscrição individual).

- [x] RN06 – Um certificado não pode ser gerado sem CPF e nome válidos.

- [x] RN07 – O template visual do certificado deve ser aplicado de forma consistente em todas as gerações.