# API de livraison sécurisée Studio Projet

Le site GitHub Pages reste statique. Cette API Node séparée reçoit le webhook Stripe, protège le ZIP et expose un tableau de bord administrateur.

## Fonctionnement

1. Le client ouvre un Payment Link Stripe.
2. Stripe redirige vers `success.html?session_id={CHECKOUT_SESSION_ID}`.
3. `success.js` demande `/api/download?session_id=...`.
4. L’API vérifie la session auprès de Stripe et exige `payment_status=paid`.
5. Le webhook `checkout.session.completed` enregistre la commande, le montant et le produit dans SQLite.
6. Le serveur renvoie le ZIP avec un lien valable pendant `DOWNLOAD_TTL_SECONDS`.
7. `/api/admin/stats` renvoie les ventes et téléchargements uniquement avec `Authorization: Bearer ADMIN_TOKEN`.

Le webhook utilise `stripe.webhooks.constructEvent` sur le corps brut. **Ne place jamais `STRIPE_SECRET_KEY` ou `ADMIN_TOKEN` dans le site public.**

## Installation locale

```bash
cd server
cp .env.example .env
npm install
npm start
```

Renseigne la clé secrète Stripe, le secret webhook et un jeton administrateur long et aléatoire dans `.env`.

## Page d’administration

La page [admin.html](../admin.html) contient son HTML, son CSS et son JavaScript dans un seul fichier, avec des retours à la ligne pour faciliter la maintenance.

1. Ouvre `admin.html`.
2. Renseigne l’URL HTTPS de l’API.
3. Renseigne la valeur de `ADMIN_TOKEN`.
4. Clique sur **Charger les données**.

La page affiche :

- ventes confirmées ;
- chiffre d’affaires ;
- nombre de téléchargements ;
- ventes par produit ;
- commandes récentes, e-mail, montant et date de téléchargement.

Le jeton est conservé uniquement dans `sessionStorage`. L’API le compare côté serveur et applique une limitation de requêtes. Évite de publier un lien vers `admin.html` avec le jeton dans l’URL.

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

par l’URL HTTPS réelle du serveur.

## Déploiement conseillé

Déploie le dossier `server` sur Render, Railway, Fly.io ou un VPS Node avec :

- commande d’installation : `npm install` ;
- commande de démarrage : `npm start` ;
- volume persistant pour `server/data/orders.sqlite` ;
- variable `DOWNLOAD_ZIP_PATH` pointant vers le ZIP livré ;
- HTTPS obligatoire ;
- `ADMIN_TOKEN` configuré dans les variables secrètes de l’hébergeur.

Le stockage SQLite doit être persistant. Sur un environnement serverless sans disque persistant, remplace SQLite par Postgres, Turso ou une autre base durable.

## Important

Les liens actuels du catalogue sont des **Payment Links Stripe test**. Ils acceptent uniquement les moyens de paiement de test. Pour vendre réellement, crée les mêmes produits en mode Live, remplace les URLs `buy.stripe.com/test_...` et utilise une clé `sk_live_...` côté serveur.
