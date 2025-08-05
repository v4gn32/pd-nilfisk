# Projeto de Interface - Portal de Documentos

## 📘 Visão Geral

Documentação das telas e fluxos de interface do sistema **Portal de Documentos**, uma plataforma para disponibilização digital de holerites, documentos corporativos e informativos.

---

## 🖥️ Telas do Sistema

### 1. Tela Home

![Tela Home](../documentos/img/01-Home%20.png)

**Descrição:**

- Informações do sistema

### 2. Tela de Login

![Tela de Login](../documentos/img/02-Login.png)

**Descrição:**

- Campos para e-mail e senha
- Botão "Entrar"
- Link para "Esqueci minha senha"
- Link para "Cadastrar-se"

---

### 3. Tela de Cadastro

![Tela de Cadastro](../documentos/img/03-Cadastro.png)

**Descrição:**

- Campos para nome completo, e-mail, senha e confirmação de senha
- Botão "Criar conta"
- Link para login

---

### 4. Dashboard (Painel Principal)

![Dashboard](../documentos/img/04-Dashboard.png)

**Elementos:**

- Menu lateral com navegação (Entregas, Holerites, Relatórios, Usuários)
- Painéis com resumo (últimos documentos, número de usuários, entregas em atraso)
- Gráficos ou alertas de vencimentos

---

### 5. Tela de Envio de Holerites

![Upload de Holerites](../documentos/img/05-Dashboard.png)

**Funcionalidades:**

- Upload em massa (.zip ou múltiplos .pdf)
- Detecção automática de nome e CPF nos PDFs
- Associação automática com o usuário
- Filtros por mês/ano
- Botão para reprocessar documentos

---

### 6. Tela de Consulta de Holerites

![Consulta Holerites](../documentos/img/06-Dashboard.png)

**Elementos:**

- Tabela com colunas: Nome, Mês, Ano, Documento, Situação
- Download do PDF
- Filtro por usuário, mês e ano
- Visualização do documento em modal ou nova aba

---

### 7. Tela de Gerenciamento de Usuários

![Usuários](../documentos/img/07-Dashboard.png)

**Funcionalidades:**

- Listagem de usuários com CPF, e-mail e tipo (admin ou colaborador)
- Ações de ativar, desativar e editar
- Criação manual de usuários
- Importação via planilha (.csv)

---

### 8. Tela de Relatórios

![Relatórios](../documentos/img/08-DashboardUser.png)

**Funcionalidades:**

- Relatórios de envio por período
- Relatórios de usuários que não visualizaram
- Exportação em PDF e Excel

---

### 9. Tela de Informativos

![Informativos](../documentos/img/09-Informativo.png)

**Elementos:**

- Lista de comunicados do RH
- Botão "Criar novo"
- Editor de texto (WYSIWYG)
- Data de publicação e destinatários

---

## 🔁 Fluxo de Navegação

```mermaid
graph TD
    A[Tela de Login] --> B[Dashboard]
    B --> C[Consulta de Holerites]
    B --> D[Envio de Holerites]
    B --> E[Usuários]
    B --> F[Relatórios]
    B --> G[Informativos]
    C --> C1[Visualizar Documento]
    D --> D1[Upload ZIP/PDF]
    E --> E1[Editar/Adicionar Usuário]
    G --> G1[Editar/Excluir Informativo]
```
