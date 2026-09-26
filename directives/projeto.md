📘 SOP Mestre: BurguerSync Ourinhos (Full-Stack Realtime)

Status: Planejamento / Inicialização | Versão: 2.5.5

1. Visão Geral e Objetivo Principal

O BurguerSync Ourinhos é uma aplicação web full-stack de pedidos e gerenciamento em tempo real (realtime) para hamburgueria artesanal. O sistema resolve o problema de comunicação e sincronização entre clientes (que realizam pedidos via interface estilo iFood) e a equipe de produção (que gerencia o fluxo da cozinha em um painel interativo). O valor entregue é a agilidade no atendimento, controle instantâneo de pedidos via Firebase Cloud Firestore e facilidade de implantação contínua na nuvem via GitHub Pages.

2. Arquitetura do Projeto (Antigravity v2.5.5 - 3 Camadas)

Layer 1 (Diretiva & Estratégia - Lógica de Negócio):

Regras do negócio contidas em /directives/, especificando o design system (design.md), regras de pedido, taxas fixas, schemas do Firestore e mapeamento de estados de transição (Recebido ➔ Em Preparo ➔ Saiu para Entrega ➔ Entregue).

Layer 2 (Orquestração / Gemini 3.8 Flash):

Interpretador inteligente das regras da Layer 1 que gera os componentes, coordena tarefas, lê credenciais e garante a consistência entre o front-end e o banco de dados.

Layer 3 (Execução & Determinismo - Código Puramente Técnico):

Scripts executáveis, build de assets, integração via Firebase SDK v10 (ES6), testes automatizados de validação de Schema e comandos CLI locais salvos em /scripts/ ou na raiz.

3. Escopo Tecnológico & Requisitos (Tech Stack)

Frontend / Interface: HTML5 semântico, CSS3 moderno (Dark Mode Neon, Flexbox/Grid) conforme directives/design/design.md e JavaScript ES6+ modular.

Backend / Realtime Database: Firebase Cloud Firestore (SDK Web v10 NoSQL via CDN em módulos ES6).

Hospedagem & Deploy: GitHub Pages (Entregáveis finais hospedados em nuvem) com automação via GitHub Actions ou branch gh-pages.

Arquivos Temporários & Cache: Todo e qualquer artefato intermediário, log de build ou rascunho de código DEVE ser mantido obrigatoriamente na pasta .tmp/ (ignorada pelo .gitignore).

Variáveis de Ambiente: Arquivo .env na raiz para injetar as chaves do Firebase (VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.).

4. Diretrizes de UX/UI e Referências Visuais

Inspiração Real: Estilo iFood e apps modernos de delivery em Dark Mode.

Identidade Visual: Paleta escura (#0F0F12), cards em #18181C, acentos em Laranja Neon (#FF8C00), destaques em Amarelo (#FFD700) e confirmações em Verde Neon (#00E676).

Experiência do Usuário: Design Mobile-First, navegação por abas/seções (#visaoCliente vs #visaoCozinha), feedbacks visuais instantâneos, badges com brilho neon para status do pedido e validações de formulário responsivas em tempo real.

5. Fluxo Operacional de Execução

Kickoff: Leitura do arquivo original de requisitos (ideia_projeto.md) e da diretriz visual (directives/design/design.md).

Ambiente Temporário: Criação da estrutura de pastas de desenvolvimento e inicialização da pasta .tmp/ para artefatos de testes preliminares.

Desenvolvimento Modular (Front & Firebase):

Construção do HTML/CSS semântico na pasta /src (ou index.html na raiz).

Configuração do módulo de conexão do Firebase Firestore (src/js/firebase-config.js).

Implementação da lógica do cliente (addDoc para salvar pedidos).

Implementação da escuta em tempo real da cozinha (onSnapshot ordenado por horario desc).

Implementação dos seletores de status (updateDoc).

Validação & Testes Locais: Execução de testes manuais e simulações armazenadas em .tmp/test-orders.json.

Empacotamento e Nuvem:

Publicação dos entregáveis finais no GitHub Pages.

Geração do guia de comandos (instruction.md) e script de atalho (executar.bat).

6. Definição de Sucesso (Deliverables)

Entregáveis Finais em Nuvem:

Aplicação web 100% funcional publicada no GitHub Pages.

Banco de Dados Firebase Firestore conectado e operacional em tempo real.

Artefatos Obrigatórios do Repositório:

README.md (Documentação moderna com screenshot e link do deploy).

instruction.md (Instruções detalhadas de execução e configuração das chaves Firebase).

executar.bat (Script autossuficiente para execução de servidor local e testes no Windows).

Pasta .tmp/ no .gitignore contendo logs e rascunhos.

7. Tratamento de Erros, Resiliência e Self-Annealing

Estratégia de Resiliência no Firestore:

Caso a conexão onSnapshot falhe ou perca a rede, o sistema deve registrar a falha em .tmp/firebase-error.log e acionar um fallback com retry automático exponential backoff.

Falha de Injeção de Variáveis de Ambiente:

Se o .env não for detectado, a aplicação deve exibir um alerta amigável na tela orientando o preenchimento das credenciais do Firebase, impedindo a submissão silenciosa de formulários quebrados.

Self-Annealing em Mudanças de Schema:

Se um documento do Firestore retornado não possuir um campo obrigatório (ex: obsEntrega ausente ou formato de horario nulo devido à latência do serverTimestamp), o parser de renderização deve aplicar safe navigation e atribuir valores padrão sem interromper a interface da cozinha.

Ciclo de Auto-Correção Documental:

Toda exceção não tratada capturada durante a execução deve gerar uma nota em .tmp/self-healing.md para que o agente ajuste os seletores CSS ou lógica de JS e re-submeta o patch.