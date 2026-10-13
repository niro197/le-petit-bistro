# Le Petit Bistro

Site vitrine statique responsive pour un restaurant fictif.

## Direction artistique
Palette : encre `#17202A`, papier `#F5F1E8`, safran `#EDB441`, piment `#D75B42`, sauge `#B9CDB8`. Fraunces porte la voix éditoriale ; DM Sans assure la lisibilité. La scène de table en CSS est l’élément mémorable, sans image distante cassée.

## À remplacer
Rechercher `[À REMPLACER` et `XX €` : adresse, ville, téléphone, e-mail, horaires, tarifs, équipe, réseaux sociaux, domaine, SIRET, hébergeur, accessibilité et conditions d’annulation.

## Formulaire
Le formulaire est préparé pour Formspree. Créer un formulaire sur https://formspree.io/, remplacer `[À REMPLACER : identifiant]` dans `index.html`, puis adapter le message de démonstration dans `js/main.js`. Un site statique n’envoie pas d’e-mail seul.

## Images à préparer
Le hero fonctionne sans image grâce à l’illustration CSS. Pour ajouter des photos, utiliser des fichiers locaux WebP dans `images/`, avec `width`, `height`, `loading="lazy"` et un `alt` descriptif. Sources possibles : Unsplash, Pexels ou Pixabay ; vérifier les licences et crédits. Canva, Figma, Coolors et Google Fonts peuvent aider pour les supports de marque.

## Mise en ligne
Publier sur GitHub Pages ou Netlify, configurer le domaine dans `canonical`, Open Graph, `robots.txt` et `sitemap.xml`, puis tester le formulaire. Vérifier les conditions du plan gratuit du service choisi.

Les pages juridiques sont à ajouter et à valider avant publication ; un modèle ne remplace pas un avis juridique.

## Commande en ligne / click and collect

La section `#commande` propose un panier côté navigateur avec filtres par catégorie, ajout et retrait d’articles, choix retrait ou livraison, date, créneau et coordonnées. Les prix restent des marqueurs `[XX €]` pour éviter d’inventer les tarifs. Le bouton final est une demande de commande : aucun paiement n’est activé. Pour la production, connecter le formulaire à un backend ou à un service de commande, puis ajouter un prestataire de paiement si nécessaire.

Un aperçu visuel a été généré dans `le-petit-bistro-preview.png` à la racine de l’environnement de travail.
