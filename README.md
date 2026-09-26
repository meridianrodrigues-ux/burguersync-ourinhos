<div align="center">

# 🍔 BurguerSync Ourinhos
### *Realtime Full-Stack Delivery & Kitchen Management System*
### *Sistema de Delivery e Gestão de Cozinha em Tempo Real*

[![Google Antigravity](https://img.shields.io/badge/Google%20Antigravity-v2.5.5-orange?style=for-the-badge&logo=google)](https://antigravity.google)
[![Google Stitch](https://img.shields.io/badge/Google%20Stitch-Design%20System-blueviolet?style=for-the-badge)](https://stitch.withgoogle.com)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Deploy-success?style=for-the-badge&logo=github)](https://meridianrodrigues-ux.github.io/burguersync-ourinhos/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B%20Modular-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![HTML5 / CSS3](https://img.shields.io/badge/UI-Dark%20Mode%20Neon-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://w3.org)

<p align="center">
  <a href="#-visão-geral-pt-br">Português (Brasil)</a> •
  <a href="#-overview-en">English</a> •
  <a href="#-arquitetura--architecture">Arquitetura</a> •
  <a href="#-como-executar--how-to-run">Como Executar</a>
</p>

🌐 **Live Demo (GitHub Pages):** [https://meridianrodrigues-ux.github.io/burguersync-ourinhos/](https://meridianrodrigues-ux.github.io/burguersync-ourinhos/)

---

</div>

## 🇧🇷 Visão Geral (PT-BR)

O **BurguerSync Ourinhos** é uma aplicação web full-stack de pedidos e gerenciamento em tempo real (realtime) para uma hamburgueria artesanal de alta performance. Desenvolvido no ecossistema **Google Antigravity (SENAI Ourinhos Edition)**, o projeto resolve a lacuna de comunicação instantânea entre o cliente (navegação estilo iFood em Dark Mode Neon) e a equipe de produção (painel Kanban reativo da cozinha com escuta contínua via **Firebase Cloud Firestore**).

### ✨ Principais Recursos
* **🛍️ Visão do Cliente:** Vitrine dinâmica com fotos gastronômicas geradas via **Google Stitch**, personalização de pedidos (observações), cálculo automático de frete para Ourinhos-SP e checkout instantâneo com geração de chave Pix copia-e-cola.
* **👨‍🍳 Visão da Cozinha (Kanban Realtime):** Escuta ativa através de `onSnapshot(orderBy("horario", "desc"))`, atualizando os cartões de pedidos instantaneamente sem necessidade de recarregar a página.
* **⚡ Design System Dark Mode Neon:** Interface concebida no **Google Stitch**, com tokens tipográficos Inter, sombras neon (#FF8C00, #00E676, #FFD700) e ergonomia mobile-first.
* **🛡️ Resiliência & Self-Annealing:** Arquitetura resiliente com safe navigation em schemas do Firestore e fallback transparente em LocalStorage para cenários offline ou permissões restritas.

---

## 🇺🇸 Overview (EN)

**BurguerSync Ourinhos** is a full-stack real-time ordering and kitchen management web application for an artisanal smash burger restaurant. Engineered with **Google Antigravity**, it synchronizes customers (intuitive ordering interface with Neon Dark aesthetics) and the kitchen team (dynamic Kanban board powered by **Firebase Cloud Firestore**).

### ✨ Key Features
* **🛍️ Customer View:** Product showcase with studio-quality imagery from **Google Stitch**, item customizations, fixed delivery fee calculation, and frictionless Pix checkout.
* **👨‍🍳 Kitchen View (Realtime Kanban):** Reactive state listening using Firestore `onSnapshot`, moving orders through stages (*Received ➔ In Preparation ➔ Out for Delivery ➔ Delivered*) in real time.
* **⚡ Dark Neon UI:** Aesthetic design system crafted in **Google Stitch**, styled with CSS3 variables, glowing badges, and fluid mobile-first layouts.
* **🛡️ Self-Annealing & Resilience:** Safe-navigation parsing on incoming NoSQL documents, combined with an automated offline LocalStorage fallback.

---

## 🤖 Agentes e Skills Utilizados (Antigravity Ecosystem)

Este projeto foi orquestrado utilizando o framework de inteligência artificial **Google Antigravity**:

| Componente | Tipo | Função |
| :--- | :--- | :--- |
| **`@orchestrator`** | Agente Mestre | Coordenação de tarefas de ponta a ponta e integração entre camadas |
| **`@app-builder`** | Skill Pack | Estruturação full-stack, scaffolding e injeção de dependências |
| **`@frontend-design`** | Skill Pack | Fidelidade estética, tipografia Inter e conformidade com o Google Stitch |
| **`@clean-code`** | Skill Pack | Práticas de código limpo, modularidade ES6 e tipagem defensiva |
| **`StitchMCP`** | Servidor MCP | Extração direta de protótipos de tela e design tokens do Google Stitch |

---

## 🏗️ Arquitetura / Architecture (3-Layer Pattern)

```
Aula07-projeto01-burguersync/
├── .github/workflows/deploy.yml   # Automação de deploy no GitHub Pages
├── directives/                    # Camada 1: Diretivas, SOPs e especificações de design
│   ├── design/                    # Design tokens e protótipo do Google Stitch
│   └── projeto.md                 # SOP Mestre do Projeto
├── frontend/                      # Camada 3: Aplicação Cliente & Cozinha
│   ├── index.html                 # Interface HTML5 semântica com abas integradas
│   ├── css/style.css              # Design system Neon Dark Mode
│   ├── js/
│   │   ├── firebase-config.js     # Conexão modular Firebase SDK v10
│   │   └── app.js                 # Lógica de negócio, carrinho e realtime Kanban
│   └── assets/images/             # Assets gastronômicos extraídos do Stitch
├── backend/                       # Camada 3: Scripts de Suporte e Carga
│   ├── seed.js                    # Script de povoamento simulado no Firestore
│   └── test-firestore.js          # Diagnóstico de conectividade
├── documentation/                 # Documentação e rastreabilidade
│   ├── architecture.md            # Diagramas e schemas
│   └── promptHistory.md           # Histórico integral de prompts da sessão
├── executar.bat                   # Atalho de inicialização local (Windows)
├── instruction.md                 # Guia de configuração e regras de segurança
├── .env.example                   # Exemplo seguro das variáveis de ambiente
└── README.md                      # Apresentação oficial bilíngue
```

---

## 🚀 Como Executar / How to Run

### 1. Execução no Windows (Atalho)
Dê um duplo clique no arquivo [`executar.bat`](file:///c:/Users/Aluno/Documents/Antigravity/Aula07-projeto01-burguersync/executar.bat) para iniciar o servidor local e abrir no seu navegador padrão em `http://localhost:8000`.

### 2. Execução via Terminal (CLI)
```bash
# Iniciar o servidor HTTP
python -m http.server 8000 --directory frontend

# Ou utilizando Node / NPX
npx serve frontend
```

### 3. Povoamento do Banco de Dados (Firestore Seed)
```bash
node backend/seed.js
```

---

## 🔒 Configuração do Firebase Cloud Firestore

Para permitir leituras e gravações no banco em desenvolvimento, aplique as seguintes regras no Console do Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

<div align="center">
  <sub>Escola SENAI "Ary Torres" • SENAI Ourinhos Edition • Desenvolvido com Google Antigravity v2.5.5</sub>
</div>
