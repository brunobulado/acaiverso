# Açaí verso 🕷️🍇 — sistema de pedidos

3 telas: `/` (cliente, é o QR Code) • `/caixa` e `/preparo` (equipe, com login).
Tecnologias: React + Vite, Firebase (Firestore + Authentication), Netlify.

## 1. Rodar no computador
1. Instale o Node.js (versão LTS) em nodejs.org.
2. Na pasta do projeto: `npm install` e depois `npm run dev` (abre em http://localhost:5173).

## 2. Criar o Firebase (gratuito, plano Spark)
1. Acesse console.firebase.google.com → **Adicionar projeto** (pode desativar o Google Analytics).
2. **Build → Firestore Database → Criar banco de dados** (modo produção, região `southamerica-east1`).
3. **Build → Authentication → Começar → E-mail/senha → Ativar.** Na aba *Users*, **Adicionar usuário** duas vezes:
   - e-mail `caixa@acaiverso.app` com a senha do Caixa;
   - e-mail `preparo@acaiverso.app` com a senha do Preparo (mínimo 6 caracteres cada).
   Esses e-mails não precisam existir de verdade. Na tela só se digita a senha, e cada tela só abre com a senha da própria função.
4. **Visão geral → ícone `</>` (Web)** → registre o app → copie o `firebaseConfig`.
5. Copie `.env.example` para `.env` e preencha com esses valores (apiKey, authDomain, projectId, appId).
6. **Firestore → aba Regras:** apague tudo, cole o conteúdo de `firestore.rules` e clique em **Publicar**.

## 3. Primeiro uso
1. Abra `/caixa`, entre com a senha do Caixa, aba **Cardápio → Carregar cardápio de exemplo**, e ajuste os preços reais.
2. Abra `/` no celular, faça um pedido de teste e acompanhe o fluxo: Caixa aceita → confirma pagamento → Preparo faz → entrega.
3. Antes da feira, apague os pedidos de teste no console do Firebase (Firestore → `orders`) e, se quiser o contador do zero, a coleção `counters`.

## 4. Publicar no Netlify (grátis)
1. Suba o projeto para um repositório no GitHub (o `.env` NÃO sobe, está no `.gitignore`).
2. No Netlify: **Add new site → Import from Git** → escolha o repositório (build `npm run build`, pasta `dist`, já configurado no `netlify.toml`).
3. **Site settings → Environment variables:** crie as 4 variáveis `VITE_FIREBASE_...` com os mesmos valores do `.env`, e faça **Trigger deploy**.
4. No Firebase: **Authentication → Settings → Domínios autorizados → Adicionar** o endereço `seusite.netlify.app`.

## 5. QR Code
Gere o QR Code do endereço principal (ex.: `https://acaiverso.netlify.app/`) — só o link da raiz, nunca o `/caixa`. Mande o link para a gente montar o cartaz com a logo.

## Observações
- O total do pedido é calculado no celular do cliente (suficiente para uma feira escolar).
- Plano gratuito do Firebase: 50 mil leituras e 20 mil gravações por dia, mais que suficiente para o evento. Acompanhe em *Firestore → Uso*.

- Se quiser outros e-mails para as contas, troque em dois lugares: `src/lib.js` (EMAILS) e `firestore.rules` (funções `caixa()` e `preparo()`).
- O Preparo só enxerga pedidos já pagos e só consegue mudar o status deles; o Caixa só mexe em pedidos ainda não pagos. Isso é garantido pelas regras do Firestore, não só pela tela.
