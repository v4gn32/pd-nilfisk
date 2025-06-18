
# 🧾 Projeto PD Nilfisk - Backend e Deploy

Este documento descreve o plano de desenvolvimento completo do backend do projeto **PD Nilfisk**, incluindo banco de dados, autenticação, upload de documentos e deploy em produção.

---

## ✅ Visão Geral

Funcionalidades já implementadas no frontend:

- Login e cadastro de usuários (admin e comum)
- Upload de documentos PDF (holerite, férias, comissões, informes)
- Processamento em massa de holerites
- Filtros por tipo, mês e ano
- Dashboard com estatísticas
- CRUD de usuários (apenas para administradores)

---

## 🔧 Backend: Node.js + Express + PostgreSQL

### 📁 Estrutura MVC

```
pd-backend/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── utils/
├── prisma/
├── .env
├── server.js
└── package.json
```

---

## 🗃️ Banco de Dados (Prisma + PostgreSQL)

### Models - `schema.prisma`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  cpf       String   @unique
  role      Role     @default(COMMON)
  documents Document[]
  createdAt DateTime @default(now())
}

model Document {
  id        Int      @id @default(autoincrement())
  type      DocumentType
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  fileUrl   String
  fileKey   String
  month     Int
  year      Int
  createdAt DateTime @default(now())
}

enum DocumentType {
  HOLERITE
  FERIAS
  COMISSAO
  INFORME_RENDIMENTO
}

enum Role {
  ADMIN
  COMMON
}
```

---

## 🔐 Autenticação (JWT + Bcrypt)

- Registro e login com senhas criptografadas
- Token JWT via `Authorization: Bearer`
- Middleware `authMiddleware` para proteger rotas
- Verificação de role (admin ou comum)

---

## 📥 Rotas da API

| Verbo  | Rota                     | Descrição                            | Auth | Admin |
|--------|--------------------------|--------------------------------------|------|-------|
| POST   | `/api/register`          | Cadastro de usuário                  | ❌    | ❌     |
| POST   | `/api/login`             | Login com e-mail e senha             | ❌    | ❌     |
| GET    | `/api/me`                | Dados do usuário logado              | ✅    | ❌     |
| POST   | `/api/upload`            | Upload de documento PDF              | ✅    | ✅     |
| GET    | `/api/documents`         | Listar documentos com filtros        | ✅    | ❌     |
| GET    | `/api/documents/:id`     | Download de um documento específico  | ✅    | ❌     |
| GET    | `/api/users`             | Listar usuários                      | ✅    | ✅     |
| POST   | `/api/users`             | Criar novo usuário                   | ✅    | ✅     |
| PUT    | `/api/users/:id`         | Atualizar dados do usuário           | ✅    | ✅     |
| DELETE | `/api/users/:id`         | Remover usuário                      | ✅    | ✅     |

---

## ☁️ Armazenamento de Arquivos (PDF)

- Em desenvolvimento: diretório local `/uploads`
- Em produção: **Amazon S3**
  - Integração via `aws-sdk`
  - `fileKey = holerite-{user}-{mes}-{ano}.pdf`

---

## 🚀 Deploy em Produção

### Backend:
- Render.com (Node.js)
- Banco PostgreSQL (Render, Supabase ou Neon)

### Frontend:
- Deploy com Vercel ou Netlify (Vite + React)

### Arquivo `.env` (exemplo)

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
JWT_SECRET=supertokenseguro - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=pd-nilfisk-bucket
```

---

## 📅 Cronograma de Entrega (1 Semana)

| Dia       | Tarefa                                                        |
|-----------|---------------------------------------------------------------|
| ✅ Hoje    | Análise e definição do plano de backend                       |
| 🛠️ Dia 2  | Estrutura do backend + models com Prisma + rotas de auth      |
| 🗃️ Dia 3  | Upload de documentos + integração com S3/local                |
| 🧪 Dia 4  | Listagem com filtros + download                               |
| 🧑‍💻 Dia 5 | CRUD completo de usuários                                     |
| 🔐 Dia 6  | Middleware de autenticação + roles                            |
| 🚀 Dia 7  | Deploy no Render/Vercel e testes finais com frontend          |

---

## 📌 Progresso

- [ ] Banco de dados PostgreSQL migrado
- [ ] Backend estruturado (MVC)
- [ ] Autenticação implementada
- [ ] Upload/documentos funcionando
- [ ] Deploy realizado

---
