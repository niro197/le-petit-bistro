
## 11. Ajouter des produits UI vendables

Les cartes vendues ne sont plus écrites directement dans `index.html`. Elles se trouvent dans `catalogue/produits.json`, séparé du code de présentation du site.

Pour ajouter un produit, copier un objet existant et renseigner `id`, `name`, `category`, `price_label`, `description` et `deliverables`. Le champ `preview` choisit l’aperçu graphique parmi les composants prévus dans `js/store.js`.

Les produits de démonstration actuels sont : `UI Gradient Button`, `Aurora Card` et `Motion Hero`. Ils représentent des composants digitaux indépendants : HTML, CSS, JavaScript léger ou documentation. Remplacez-les par vos vrais produits et vérifiez que chaque livrable est réellement inclus dans le dossier remis à l’acheteur.

## 12. Panier et commandes

Le fichier `js/store.js` charge le JSON, affiche les cartes, filtre les catégories et gère le panier. Le bouton « Acheter maintenant » ouvre le checkout du produit sélectionné.

Les prix sont affichés en dollars. Le checkout redirige vers le Payment Link Stripe renseigné dans le catalogue.

## 13. Stripe

Pour vendre avec Stripe, créer un Payment Link ou un produit Stripe réel pour chaque produit. Copier ensuite l’URL publique dans le champ `stripe_payment_link` du fichier `catalogue/produits.json`.

Ne jamais placer une clé secrète Stripe dans `index.html`, `js/store.js` ou un autre fichier public. Pour un paiement entièrement automatisé avec création de commande, il faudra un backend ou Stripe Checkout côté serveur. Le site statique peut utiliser des Payment Links publics, mais la confirmation et la livraison doivent être prévues séparément.

Avant la mise en vente, tester : ajout au panier, retrait d’un produit, checkout Stripe, redirection vers `success.html` et téléchargement du ZIP. Vérifier également les droits de distribution de chaque composant vendu.

## 14. Page après paiement

`success.html` est la page de confirmation. Elle contient le lien vers `packs/ui-components.zip`. Un téléchargement statique peut être partagé par URL ; pour protéger réellement les fichiers, utiliser un serveur ou un webhook Stripe qui génère un lien signé après paiement.
