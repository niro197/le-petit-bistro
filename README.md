
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
