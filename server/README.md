# API de livraison sécurisée Studio Projet

Le site GitHub Pages reste statique. Cette API Node séparée reçoit le webhook Stripe, protège le ZIP et expose un tableau de bord administrateur.

## Fonctionnement

1. Le client ouvre un Payment Link Stripe.
2. Stripe redirige vers `success.html?session_id={CHECKOUT_SESSION_ID}`.
3. `success.js` demande `/api/download?session_id=...`.
4. L’API vérifie la session auprès de Stripe et exige `payment_status=paid`.
5. Le webhook `checkout.session.completed` enregistre la commande, le montant et le produit dans SQLite.
6. Le serveur renvoie le ZIP avec un lien valable pendant `DOWNLOAD_TTL_SECONDS`.
7. `/api/admin/login` vérifie un mot de passe avec un hash scrypt et renvoie un jeton de session temporaire.
8. `/api/admin/stats` renvoie les ventes et téléchargements avec ce jeton temporaire.

Le webhook utilise `stripe.webhooks.constructEvent` sur le corps brut. **Ne place jamais `STRIPE_SECRET_KEY`, le hash du mot de passe ou le secret de session dans le site public.**

## Installation locale

```bash
cd server
cp .env.example .env
npm install
npm start
```

## Configurer le mot de passe admin

Ne mets jamais le mot de passe en clair dans `.env`. Génère un hash scrypt avec cette commande, en remplaçant le texte entre guillemets :

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);const k=c.scryptSync(process.argv[1],s,64,{N:16384,r:8,p:1});console.log('scrypt$'+s.toString('hex')+'$'+k.toString('hex'))" "TonMotDePasseLongEtUnique"
```

Ajoute la sortie dans :

```env
ADMIN_PASSWORD_HASH=scrypt$...
ADMIN_SESSION_SECRET=une_valeur_aleatoire_differente_et_tres_longue
```

Pour générer le secret de session :

```bash
openssl rand -hex 32
```

La page admin envoie le mot de passe uniquement à `/api/admin/login` en HTTPS. Elle ne le stocke pas : elle conserve seulement un jeton de session temporaire dans `sessionStorage`.

## Page d’administration

La page [admin.html](../admin.html) contient son HTML, son CSS et son JavaScript dans un seul fichier lisible.

1. Ouvre `admin.html`.
2. Renseigne l’URL HTTPS de l’API.
3. Renseigne le mot de passe configuré côté serveur.
4. Clique sur **Se connecter et charger**.

La page affiche les ventes confirmées, le chiffre d’affaires, les téléchargements, les ventes par produit et les commandes récentes.

## Pourquoi un seul modèle est payé à la fois ?

Chaque composant possède son propre Payment Link Stripe et son propre prix. Le bouton **Acheter** ouvre donc directement le checkout du composant sélectionné. Le panier visuel peut contenir plusieurs composants, mais le bouton de paiement demande actuellement de sélectionner un seul composant à la fois pour éviter de facturer plusieurs produits avec un lien Stripe individuel. Pour vendre des paniers multi-produits, il faut ajouter une route backend qui crée une Stripe Checkout Session avec plusieurs `line_items`.

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

Déploie le dossier `server` sur Render, Railway, Fly.io ou un VPS Node avec `npm install`, `npm start`, HTTPS, un volume persistant pour `server/data/orders.sqlite`, `DOWNLOAD_ZIP_PATH`, `ADMIN_PASSWORD_HASH` et `ADMIN_SESSION_SECRET` dans les variables secrètes de l’hébergeur.

Le stockage SQLite doit être persistant. Sur un environnement serverless sans disque persistant, remplace SQLite par Postgres, Turso ou une autre base durable.

## Important

Les liens actuels du catalogue sont des **Payment Links Stripe test**. Ils acceptent uniquement les moyens de paiement de test. Pour vendre réellement, crée les mêmes produits en mode Live, remplace les URLs `buy.stripe.com/test_...` et utilise une clé `sk_live_...` côté serveur.
