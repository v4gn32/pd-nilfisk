# 🧪 Plano de Testes de Software — Portal de Documentos

## CT-001 - Cadastro de Usuários

**Requisito Relacionado:** RF-001  
**Prioridade:** Alta  
**Descrição:** Testar o cadastro de usuários (nome, CPF, e-mail, senha), garantindo que todos os campos obrigatórios sejam validados e que não haja duplicidade de CPF.

| ID        | Cenário                 | Entrada                                                                  | Resultado Esperado                      |
| --------- | ----------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| CT-001-01 | Cadastro válido         | Nome: João, CPF: 123.456.789-00, E-mail: joao@email.com, Senha: \*\*\*\* | Usuário cadastrado com sucesso          |
| CT-001-02 | CPF duplicado           | CPF já existente no sistema                                              | Mensagem de erro informando duplicidade |
| CT-001-03 | E-mail inválido         | E-mail: "joao"                                                           | Mensagem de erro de validação           |
| CT-001-04 | Campo obrigatório vazio | Nome ou senha em branco                                                  | Mensagem de erro de campo obrigatório   |

## CT-002 - Login de Usuário

**Requisito Relacionado:** RF-002  
**Prioridade:** Alta  
**Descrição:** Validar login com CPF e senha, garantindo autenticação correta e tratamento de falhas.

| ID        | Cenário          | Entrada                             | Resultado Esperado                                 |
| --------- | ---------------- | ----------------------------------- | -------------------------------------------------- |
| CT-002-01 | Login válido     | CPF: 123.456.789-00, Senha: correta | Acesso permitido e redirecionamento para dashboard |
| CT-002-02 | CPF inexistente  | CPF não cadastrado                  | Mensagem de erro                                   |
| CT-002-03 | Senha incorreta  | CPF correto, senha errada           | Mensagem de erro                                   |
| CT-002-04 | Campos em branco | CPF e/ou senha vazios               | Mensagem de erro de preenchimento obrigatório      |

## CT-003 - Upload de Holerites (Admin)

**Requisito Relacionado:** RF-003  
**Prioridade:** Alta  
**Descrição:** Verificar upload em massa de holerites em PDF, extração de CPF, data e separação por colaborador.

| ID        | Cenário            | Entrada                                 | Resultado Esperado                                    |
| --------- | ------------------ | --------------------------------------- | ----------------------------------------------------- |
| CT-003-01 | Upload válido      | PDF com múltiplos holerites             | Arquivos separados e associados aos CPFs corretamente |
| CT-003-02 | Formato inválido   | Arquivo .docx                           | Mensagem de erro de formato                           |
| CT-003-03 | CPF não encontrado | Holerite com CPF inexistente no sistema | Upload parcial com notificação de erro                |
| CT-003-04 | Data ausente       | Página sem data MM/AAAA                 | Mensagem de erro informando necessidade de correção   |

## CT-004 - Consulta de Holerites (Usuário)

**Requisito Relacionado:** RF-004  
**Prioridade:** Alta  
**Descrição:** Validar consulta e exibição de holerites por mês e ano.

| ID        | Cenário                | Entrada                            | Resultado Esperado                     |
| --------- | ---------------------- | ---------------------------------- | -------------------------------------- |
| CT-004-01 | Consulta válida        | Mês: 03, Ano: 2025                 | Holerites listados                     |
| CT-004-02 | Consulta sem resultado | Mês: 01, Ano: 2020 (sem holerites) | Mensagem: “Nenhum holerite encontrado” |
| CT-004-03 | Filtro vazio           | Nenhum filtro aplicado             | Exibir todos os holerites do usuário   |

## CT-005 - Notificação por E-mail

**Requisito Relacionado:** RF-005  
**Prioridade:** Média  
**Descrição:** Testar envio de notificações automáticas por e-mail após upload de novo holerite.

| ID        | Cenário            | Entrada                      | Resultado Esperado                 |
| --------- | ------------------ | ---------------------------- | ---------------------------------- |
| CT-005-01 | Upload com sucesso | Novo holerite do mês 04/2025 | E-mail enviado para usuário        |
| CT-005-02 | Falha no envio     | Falha de integração com SMTP | Mensagem de erro registrada em log |

## CT-006 - Painel do Administrador

**Requisito Relacionado:** RF-006  
**Prioridade:** Média  
**Descrição:** Verificar acesso ao painel com listagem de holerites, usuários e relatórios.

| ID        | Cenário                     | Entrada                  | Resultado Esperado                      |
| --------- | --------------------------- | ------------------------ | --------------------------------------- |
| CT-006-01 | Acesso válido               | Admin logado             | Painel carregado com dados              |
| CT-006-02 | Usuário comum tenta acessar | Login com usuário normal | Acesso negado com mensagem de permissão |

## CT-007 - Logout

**Requisito Relacionado:** RF-007  
**Prioridade:** Baixa  
**Descrição:** Validar o logout e redirecionamento à tela de login.

| ID        | Cenário         | Entrada                    | Resultado Esperado                             |
| --------- | --------------- | -------------------------- | ---------------------------------------------- |
| CT-007-01 | Logout manual   | Clique no botão "Sair"     | Sessão encerrada e redirecionamento para login |
| CT-007-02 | Sessão expirada | Inatividade por 30 minutos | Sessão finalizada automaticamente              |

---

# 🧾 Evidências de Testes

## Parte 1 - Testes Unitários

**Exemplo:**

- **Critério de Êxito:** O sistema redireciona para o dashboard após login com CPF e senha corretos
- **CT:** CT-002-01 - Login Válido
- **Responsável pelo Teste:** Vagner Oliveira
- **Data do Teste:** \_\_\_/05/2025
- **Comentário:** Login funcionando corretamente

🎥 **Evidência:** [Vídeo do Teste Login Válido](https://github.com/v4gn32/eHolerite/assets/example-login-video)

## Parte 2 - Testes por Pares

**Exemplo:**

- **Critério de Êxito:** O sistema separa corretamente os holerites com base nos CPFs
- **CT:** CT-003-01 - Upload Válido de Holerites
- **Responsável pela Funcionalidade:** Vagner Oliveira
- **Responsável pelo Teste:** Michel Santos
- **Data do Teste:** \_\_\_/05/2025
- **Comentário:** Holerites divididos corretamente e armazenados na AWS S3

🎥 **Evidência:** [Vídeo do Teste de Upload](https://github.com/v4gn32/eHolerite/assets/example-upload-video)
