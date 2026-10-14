
## Boutique de produits UI

Les produits vendables sont séparés du code de la page dans `catalogue/produits.json`. Pour ajouter ou modifier un produit, changer uniquement ce fichier : nom, catégorie, description, livrables, prix et lien Stripe.

La logique de boutique est dans `js/store.js` :

- chargement du catalogue JSON ;
- filtres par catégorie ;
- ajout, retrait et quantité dans le panier ;
- préparation d’une demande de commande ;
- emplacement prévu pour un lien de paiement Stripe par produit.

Le mode actuel est `quote` / **Sur devis**. Pour activer un vrai paiement Stripe, renseigner `stripe_payment_link` avec un Payment Link Stripe réel après avoir fixé les prix et les livrables. Ne jamais mettre de clé secrète Stripe dans le HTML ou le JavaScript public.

## Recherche et filtres

La boutique comprend maintenant une recherche instantanée par nom, catégorie, description et livrables. Elle fonctionne avec les filtres de catégorie et met à jour le compteur de résultats sans recharger la page.

## Paiement Stripe et livraison sécurisée

Les 19 produits ont maintenant des Payment Links Stripe **en mode test**. Ils redirigent avec `{CHECKOUT_SESSION_ID}` vers `success.html`. Le dossier `server/` contient une API Node complète : signature webhook Stripe, vérification `payment_status=paid`, SQLite, expiration des téléchargements et envoi du ZIP sans exposer directement le fichier.

Avant mise en production : déployer `server/` sur un hébergement Node HTTPS avec volume persistant, renseigner `server/.env`, configurer le webhook Stripe et remplacer `data-api-base` dans `success.html`. Les liens `buy.stripe.com/test_...` doivent être remplacés par des liens Live.

## Aperçus interactifs

Chaque carte propose maintenant un bouton **Aperçu**. La modale affiche le composant, sa catégorie, sa description, son prix et son bouton d’achat. Le bouton `Échap` et le clic sur le fond ferment la modale.

## Administration

[Ouvrir la page d’administration](admin.html) — HTML, CSS et JavaScript réunis dans un seul fichier lisible. Elle affiche les ventes, le chiffre d’affaires, les téléchargements et les commandes récentes via `/api/admin/stats`. L’accès exige le `ADMIN_TOKEN` configuré côté serveur.
