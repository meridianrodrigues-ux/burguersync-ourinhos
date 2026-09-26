# Histórico de Prompts - BurguerSync Ourinhos

## Sessão: 26/09/2026

### Prompt 1 (Entrada do Usuário)
```text
/agente-orquestrador /grill-me /goal execute o conteudo do arquivo /directives/projeto.md, utilize a integração com nosso projeto no google stitch para o design, com o banco de dados no firebase e por fim publique em um repositorio no github. todas as chaves no arquivo .env
```

---

### Alinhamento de Decisões de Design & Arquitetura (/grill-me)

1. **Repositório GitHub & Visibilidade:**
   * **Pergunta:** Qual configuração você prefere para a publicação do repositório no GitHub (usuário: `meridianrodrigues-ux`)?
   * **Resposta Escolhida:** `(Recommended) Criar repositório público chamado 'burguersync-ourinhos' e habilitar o GitHub Pages`.

2. **Organização de Pastas e Deploy:**
   * **Pergunta:** Qual estratégia de organização de pastas e deploy do GitHub Pages você deseja adotar?
   * **Resposta Escolhida:** `(Recommended) Estrutura oficial (/frontend, /backend, /documentation) com GitHub Actions e branch gh-pages para o deploy automático do frontend`.

3. **Catálogo e Dados Iniciais:**
   * **Pergunta:** Deseja incluir um script auxiliar no /backend para teste e povoamento automático do Firebase Firestore com o cardápio e pedidos simulados?
   * **Resposta Escolhida:** `(Recommended) Incluir cardápio completo com dados e imagens reais do Google Stitch, além de script no backend para simulação de pedidos de teste`.

---

### Prompt 2 (Diagnóstico e Correção de Persistência no Firebase)
```text
/agente-orquestrador /grill-me /goal a aplicação está funcionando, porém não salvou no banco de dados no firebase. favor corrigir
```

* **Diagnóstico da Causa Raiz:**
  A chamada ao Firebase SDK retorna `PERMISSION_DENIED: Missing or insufficient permissions`. As regras de segurança padrão do Firestore (`firestore.rules`) no projeto `burguersync-meridian` estão bloqueando leitura e escrita (`allow read, write: if false;`), ativando o fallback de resiliência local.
* **Ações de Correção:**
  1. Identificação da regra restritiva no Firebase Console.
  2. Ajuste do tratamento e feedback visual no frontend caso o Firestore rejeite por permissão.
  3. Instrução clara e objetiva para liberação das regras de teste no Firestore Database Rules.
