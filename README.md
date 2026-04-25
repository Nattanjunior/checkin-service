# API Style Gypass

API REST para gerenciamento de usuários, academias e check-ins, construída com `Node.js`, `TypeScript`, `Fastify`, `Prisma` e `PostgreSQL`.

## Descrição

A aplicação simula o backend de um sistema de check-in em academias. Usuários podem se cadastrar, fazer login, buscar academias, listar academias próximas e registrar check-ins. Algumas ações são restritas a administradores, como cadastrar academias e validar check-ins.

## O que a aplicação faz

- cadastro de usuários
- autenticação com `JWT`
- renovação de token com `refresh token`
- consulta de perfil do usuário autenticado
- cadastro de academias
- busca de academias por nome
- listagem de academias próximas
- criação de check-ins
- histórico de check-ins
- métricas de check-ins do usuário
- validação de check-ins por administradores

## Geolocalização

Um dos pontos centrais do projeto é o uso de latitude e longitude.

A aplicação usa coordenadas geográficas para:

- buscar academias próximas do usuário
- validar se o usuário está perto o suficiente da academia para realizar um check-in

No fluxo de check-in, a API compara a latitude e longitude enviadas pelo usuário com as coordenadas da academia cadastrada. Se a distância estiver acima do limite definido pela regra de negócio, o check-in é bloqueado.

## Arquitetura

O projeto está organizado em camadas:

- `controllers`: recebem a requisição HTTP, validam entrada e devolvem a resposta
- `use-cases`: concentram as regras de negócio
- `repositories`: definem contratos de acesso a dados
- `repositories/prisma`: implementações reais com banco PostgreSQL
- `repositories/in-memory`: implementações em memória para testes unitários
- `prisma`: schema e migrations do banco

Fluxo principal:

1. a rota recebe a requisição
2. o controller valida os dados
3. o controller chama um caso de uso
4. o caso de uso aplica a regra de negócio
5. o repositório acessa o banco via Prisma

## Tecnologias

- `Node.js`
- `TypeScript`
- `Fastify`
- `Prisma`
- `PostgreSQL`
- `Zod`
- `JWT`
- `Vitest`
- `Supertest`
- `Docker Compose`

## Como rodar com Docker

O repositório possui `docker-compose.yml` para subir o PostgreSQL. A API roda localmente na máquina, enquanto o banco roda em container.

### Pré-requisitos

- `Docker`
- `Docker Compose`
- `Node.js`
- `npm`

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd api-style-gypass
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o `.env`

No PowerShell:

```powershell
Copy-Item .env.exemple .env
```

Use um formato de conexão como este:

```env
NODE_ENV=dev
JWT_SECRET=uma_chave_segura
PORT=3334
DATABASE_URL="postgresql://docker:docker@localhost:5432/apigyss_bd?schema=public"
```

### 4. Subir o banco com Docker

```bash
docker-compose up -d
```

### 5. Rodar as migrations

```bash
npx prisma migrate deploy
```

### 6. Subir a API

```bash
npm run dev
```

Aplicação disponível em:

- `http://localhost:3334`

## Testes

O projeto possui dois tipos principais de teste.

### Testes unitários

Executam as regras de negócio isoladamente, usando repositórios em memória.

```bash
npm run test
```

### Testes E2E

Testam a API de ponta a ponta, com requisições HTTP reais e banco PostgreSQL.

Para isso, foi criado um `Test Environment` específico para os testes E2E. Ele tem como objetivo criar um banco isolado para cada arquivo de teste E2E, aplicar as migrations no início da execução e apagar esse ambiente ao final dos testes.

Essa estratégia melhora a confiabilidade dos testes, evita compartilhamento de estado entre arquivos, reduz interferências entre execuções e ajuda a manter mais performance e qualidade no processo de validação da aplicação.

```bash
npm run test:e2e
```

### Cobertura

```bash
npm run test:coverage
```

