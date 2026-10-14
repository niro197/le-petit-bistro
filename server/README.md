# API de livraison sécurisée Studio Projet

Le site GitHub Pages reste statique. Cette API Node séparée reçoit le webhook Stripe et protège le ZIP.

## Fonctionnement

1. Le client ouvre un Payment Link Stripe.
2. Stripe redirige vers `success.html?session_id={CHECKOUT_SESSION_ID}`.
3. `success.js` demande `/api/download?session_id=...`.
4. L’API vérifie la session auprès de Stripe et exige `payment_status=paid`.
5. Le webhook `checkout.session.completed` enregistre la commande dans SQLite.
6. Le serveur renvoie le ZIP avec un lien valable pendant `DOWNLOAD_TTL_SECONDS`.

Le webhook utilise `stripe.webhooks.constructEvent` sur le corps brut. **Ne place jamais `STRIPE_SECRET_KEY` dans le site public.**

## Installation locale

```bash
cd server
cp .env.example .env
npm install
npm start
```

Place la vraie clé secrète de test et le secret `whsec_...` dans `.env`.

## Créer le webhook Stripe

Dans Stripe Dashboard, mode Test :

- Endpoint : `https://[À REMPLACER : domaine-api]/api/stripe/webhook`
- Événement : `checkout.session.completed`
- Événement conseillé : `checkout.session.async_payment_succeeded`
- Copie le signing secret `whsec_...` dans `STRIPE_WEBHOOK_SECRET`.

Test local avec Stripe CLI :

```bash
stripe listen --forward-to localhost:8787/api/stripe/webhook
stripe trigger checkout.session.completed
```

## Brancher le site statique

Dans `success.html`, remplace :

```html
data-api-base="[À REMPLACER : URL API HTTPS]"
```

par exemple :

```html
data-api-base="https://api.studio-projets.example"
```

Puis pousse le site sur GitHub Pages.

## Déploiement conseillé

Déploie le dossier `server` sur Render, Railway, Fly.io ou un VPS Node avec :

- commande d’installation : `npm install`
- commande de démarrage : `npm start`
- volume persistant pour `server/data/orders.sqlite`
- variable `DOWNLOAD_ZIP_PATH` pointant vers le ZIP livré
- HTTPS obligatoire

Le stockage SQLite doit être persistant. Sur un environnement serverless sans disque persistant, remplace SQLite par Postgres, Turso ou une autre base durable.

## Important

Les liens actuels du catalogue sont des **Payment Links Stripe test**. Ils acceptent uniquement les moyens de paiement de test. Pour vendre réellement, crée les mêmes produits en mode Live, remplace les URLs `buy.stripe.com/test_...` et utilise une clé `sk_live_...` côté serveur.
