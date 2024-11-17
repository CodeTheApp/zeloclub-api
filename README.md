# ZeloClub API

API REST para o ZeloClub desenvolvida com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- Node.js com TypeScript
- Express.js para rotas e middleware
- Prisma como ORM
- PostgreSQL como banco de dados
- AWS S3 para armazenamento de arquivos
- Auth0 para autenticação
- MailerSend para envio de emails

## 📁 Estrutura do Projeto

```
src/
  ├── config/           # Configurações da aplicação
  │   ├── env.ts
  │   └── uploadConfig.ts
  ├── controllers/      # Controladores da API
  ├── entities/         # Entidades do domínio
  ├── lib/             # Bibliotecas e configurações
  ├── middlewares/     # Middlewares Express
  ├── repositories/    # Camada de acesso a dados
  ├── routes/          # Rotas da API
  ├── services/        # Lógica de negócio
  └── index.ts         # Ponto de entrada da aplicação
```

## 🔧 Pré-requisitos

- Node.js
- PostgreSQL
- Conta AWS (para S3)
- Conta Auth0
- Conta MailerSend

## 🚀 Começando

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd zeloclub-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` com as seguintes variáveis:
```
DATABASE_URL=
JWT_SECRET=
SENDGRID_API_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH0_SECRET=
```

4. **Configure o banco de dados**
```bash
npm run db:migrate
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia o servidor de desenvolvimento
npm run build        # Gera o build de produção
npm run start        # Inicia o servidor de produção

# Banco de Dados
npm run db:push      # Atualiza o banco com o schema
npm run db:studio    # Abre o Prisma Studio
npm run db:migrate   # Executa as migrações
npm run db:deploy    # Deploy das migrações
npm run db:reset     # Reseta o banco de dados
npm run generate     # Gera o cliente Prisma
```

## 📦 Principais Dependências

- `express`: Framework web
- `@prisma/client`: ORM para banco de dados
- `express-openid-connect`: Autenticação com Auth0
- `multer` e `multer-s3`: Upload de arquivos para AWS S3
- `mailersend`: Serviço de envio de emails
- `class-validator`: Validação de dados
- `aws-sdk`: SDK da AWS

## 📝 Licença

ISC
