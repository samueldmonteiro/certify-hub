# CertifyHub 🎓

**CertifyHub** é uma plataforma fullstack para **geração e gerenciamento de certificados de alunos**, desenvolvida com foco em escalabilidade, organização de código e boas práticas de arquitetura.

O projeto utiliza **Next.js**, **TypeScript** e **Prisma**, com o back-end estruturado seguindo os princípios de **Clean Architecture**, garantindo desacoplamento, testabilidade e facilidade de manutenção.

---

## ✨ Funcionalidades (Visão Geral)

- Geração de certificados digitais para alunos.
- Painel administrativo com login, para gerenciamento.
- Suporte à importação de planilhas (.xlsx) com dados para geração dos certificados.

---

## 🧱 Tecnologias Utilizadas

- **Next.js** – Framework React fullstack
- **TypeScript** – Tipagem estática
- **Prisma ORM** – Acesso ao banco de dados
- **PostgreSQL** – Banco de dados relacional
- **Docker & Docker Compose** – Padronização de ambiente
- **Vitest** – Testes unitários e de integração
- **Clean Architecture** – Organização do back-end

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão LTS recomendada)
- **Docker**
- **Docker Compose**
- **pnpm**

---

## 🐳 Banco de Dados com Docker Compose

### Subir os containers

~~~bash
docker-compose up -d
~~~

Isso irá iniciar o banco de dados PostgreSQL em segundo plano.

### Parar os containers

~~~bash
docker-compose down
~~~

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

~~~env
NODE_ENV=dev # prod

DB_USER=user
DB_PASSWORD=password
DB_DATABASE=database

JWT_SECRET=
JWT_TTL='1h'

DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
~~~

Ajuste as variáveis conforme necessário.

---

## 🧪 Testes

Testes são tratados como **parte essencial do projeto**, não como um detalhe opcional.


### 🧰 Stack de Testes

- **Vitest** – Runner de testes
- **Prisma** – Banco isolado para testes
- **PostgreSQL** - Uso de schemas isolados para os testes.


#### 1️⃣ Arquivo de variáveis de ambiente

Crie um arquivo `.env.test` com base no `.env.test.example`.

~~~env
NODE_ENV=test

DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=tests"
~~~

---

### ▶️ Rodando os Testes

#### Rodar todos os testes

~~~bash
pnpm test
~~~

#### Modo watch (desenvolvimento)

~~~bash
pnpm test:watch
~~~

#### Testes com coverage

~~~bash
pnpm test:coverage
~~~

#### Testes por tipo (unit, integration, e2e)

~~~bash
pnpm test --project unit
~~~

---

## 🧬 Prisma

### Gerar o client do Prisma

~~~bash
pnpm prisma generate
~~~

### Rodar as migrations (dev)

~~~bash
pnpm prisma migrate dev
~~~

---

## ▶️ Rodando a Aplicação

### Ambiente de desenvolvimento

~~~bash
pnpm install
pnpm dev
~~~

A aplicação estará disponível em:

~~~text
http://localhost:3000
~~~

---

## 🏗️ Arquitetura

O back-end segue os princípios de **Clean Architecture**, promovendo:

- Separação de responsabilidades
- Independência de frameworks
- Domínio desacoplado de infraestrutura
- Alta testabilidade
- Facilidade para manutenção e evolução

Cada módulo da aplicação é organizado por domínio, evitando dependências cruzadas e acoplamento desnecessário.

---


Feito com código limpo, testes confiáveis e uma arquitetura que não te abandona no crescimento 🚀
