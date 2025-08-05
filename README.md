# 📄 Portal de Documentos

O **Portal de Documentos** é um sistema web completo para empresas que desejam distribuir holerites e documentos de forma segura, prática e moderna.

## 🚀 Funcionalidades

- Upload em massa de holerites em PDF
- Identificação automática por colaborador
- Consulta por mês/ano
- Notificação por e-mail
- Painel de RH com relatórios
- Armazenamento em AWS S3
- Login com autenticação segura

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Armazenamento**: AWS S3
- **Deploy**: Render

## 👤 Acesso

- Usuário RH/Admin
- Colaborador

## 📂 Estrutura do Projeto

- `/frontend` → Interface do sistema
- `/backend` → API e regras de negócio
- `/docs` → Documentação técnica e de requisitos

## 📌 Como rodar o projeto localmente

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/portal-de-documentos.git
   cd portal-de-documentos
   ```

2. **Backend** (`/backend`)

   ```bash
   cd backend
   npm install
   # configure o arquivo .env com suas credenciais
   npm run dev
   ```

3. **Frontend** (`/frontend`)
   ```bash
   cd ../frontend
   npm install
   # configure o arquivo .env com VITE_API_URL=http://localhost:5000
   npm run dev
   ```

> Acesse: `http://localhost:5173` (frontend) e `http://localhost:5000` (backend)

# Documentação

<ol>
<li><a href="documentos/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="documentos/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="documentos/03-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="documentos/04-Testes de Software.md"> Testes de Software</a></li>
<li><a href="documentos/05-Implantação.md"> Implantação</a></li>
</ol>

## 📧 Contato

**Vagner de Oliveira Florencio**

<a href="https://www.linkedin.com/in/vagner-florencio-85679860/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>

<a href="https://www.instagram.com/v4gn32/" target="_blank">
  <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
</a>
