# 📘 Guia de Execução e Configuração - BurguerSync Ourinhos

Este documento apresenta o guia passo a passo para configuração de credenciais, execução local e implantação do **BurguerSync Ourinhos**.

---

## 🚀 1. Execução Rápida Local (Windows)

Para iniciar o projeto localmente com um clique no Windows:
1. Dê um duplo clique no arquivo [`executar.bat`](file:///c:/Users/Aluno/Documents/Antigravity/Aula07-projeto01-burguersync/executar.bat).
2. O script iniciará um servidor HTTP na pasta `/frontend` e abrirá automaticamente no seu navegador em `http://localhost:8000`.

### Execução via Terminal (PowerShell / Bash)
```powershell
# A partir da raiz do projeto:
python -m http.server 8000 --directory frontend
# ou utilizando npx:
npx serve frontend
```

---

## 🔑 2. Configuração das Chaves Firebase (.env)

As credenciais do Firebase Cloud Firestore estão parametrizadas e centralizadas no arquivo `.env` na raiz do projeto:

```env
FIREBASE_apiKey="AIzaSyDst7hVW71qdgSaQs0O-2DXulxdushQmKU"
FIREBASE_authDomain="burguersync-meridian.firebaseapp.com"
FIREBASE_projectId="burguersync-meridian"
FIREBASE_storageBucket="burguersync-meridian.firebasestorage.app"
FIREBASE_messagingSenderId="591456028440"
FIREBASE_appId="1:591456028440:web:8759c4a668ee789adb006d"
```

### Regras de Segurança do Cloud Firestore (Console do Firebase)
Para permitir que o cliente e o painel da cozinha realizem leitura e gravação em tempo real:
1. Acesse o [Firebase Console](https://console.firebase.google.com).
2. Selecione o projeto `burguersync-meridian`.
3. Vá em **Firestore Database** > aba **Rules**.
4. Atualize as regras para permitir leitura/escrita durante a fase de desenvolvimento/avaliação:
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
5. Clique em **Publish** (Publicar).

> **Nota de Resiliência:** Caso o Firebase esteja offline ou com permissões restritas, o sistema aciona automaticamente o **Modo Resiliente com Fallback Local (LocalStorage)**, permitindo testar pedidos e o fluxo da cozinha normalmente sem travar a interface!

---

## 🛠️ 3. Scripts de Apoio no `/backend`

* **Seed de Dados:** Para inserir pedidos de teste simulados no banco de dados:
```bash
node backend/seed.js
```
* **Diagnóstico de Conexão:** Para checar a conectividade com o Cloud Firestore:
```bash
node backend/test-firestore.js
```

---

## 🌐 4. Publicação no GitHub e GitHub Pages

* **Repositório GitHub:** `https://github.com/meridianrodrigues-ux/burguersync-ourinhos`
* **GitHub Pages:** O workflow automatizado em `.github/workflows/deploy.yml` compila e entrega a pasta `/frontend` na branch `gh-pages`.
