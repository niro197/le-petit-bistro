# Guide client — Le Petit Bistro

Ce document explique exactement quoi modifier avant de livrer le site à un restaurant.

> **Important :** les éléments entre crochets, comme `[À REMPLACER : téléphone]`, sont des marqueurs de contenu. Ils ne doivent pas rester visibles sur le site final.

## 1. Les fichiers à connaître

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `index.html` | Contenu de la page : textes, menu, formulaires, coordonnées | Oui |
| `css/style.css` | Couleurs, tailles, mise en page et responsive | Seulement pour le design |
| `js/main.js` | Menu mobile, panier, filtres et messages des formulaires | Pour brancher les services |
| `images/favicon.svg` | Icône de l’onglet du navigateur | Facultatif |
| `mentions-legales.html` | Mentions légales | Oui, avec les informations juridiques |
| `confidentialite.html` | Politique de confidentialité | Oui, avec validation juridique |
| `robots.txt` | Autorise les moteurs de recherche | Oui, pour le domaine final |
| `sitemap.xml` | Adresse du site pour le référencement | Oui, pour le domaine final |

## 2. La méthode la plus simple

1. Ouvrir le dossier du site dans Visual Studio Code.
2. Utiliser `Ctrl + Shift + F` pour rechercher :

```text
[À REMPLACER
[XX €]
```

3. Remplacer chaque occurrence par une information réelle.
4. Ne jamais supprimer les balises HTML autour du texte.
5. Enregistrer les fichiers.
6. Ouvrir `index.html` dans un navigateur pour vérifier le résultat.

## 3. Informations du restaurant à fournir

Avant toute mise en ligne, demander au client :

- Nom commercial définitif.
- Logo en SVG ou PNG, idéalement avec fond transparent.
- Adresse complète.
- Ville et code postal.
- Téléphone.
- Adresse e-mail de réception.
- Horaires d’ouverture et jours de fermeture.
- Lien Google Maps.
- Liens Instagram et Facebook.
- Année de création si elle est affichée.
- Nom de la personne ou de l’équipe à afficher.
- Nombre maximum de personnes pour les groupes.
- Politique d’annulation.
- Informations d’accessibilité.
- SIRET et informations de l’entreprise.
- Nom de l’hébergeur.

## 4. Modifier les prix et la carte

Dans `index.html`, remplacer chaque valeur :

```text
[XX €]
```

Exemple :

```html
<strong>14 €</strong>
```

Il faut mettre à jour les prix dans deux zones :

1. La section **La carte**.
2. La section **Commander**.

Pour que le panier calcule automatiquement les totaux, remplacer aussi les attributs :

```html
data-price="0"
```

Exemple :

```html
data-price="14"
```

Le prix visible et le prix technique doivent toujours correspondre.

## 5. Réservation de table

Le formulaire se trouve dans la section `id="reservation"`.

Il faut remplacer :

```text
[À REMPLACER : identifiant]
```

par l’identifiant réel du formulaire Formspree.

### Branchement Formspree

1. Créer un compte sur [Formspree](https://formspree.io/).
2. Créer un nouveau formulaire.
3. Copier l’identifiant fourni.
4. Remplacer l’identifiant dans l’attribut `action` du formulaire.
5. Tester avec une vraie adresse e-mail.
6. Vérifier que la demande arrive bien dans la boîte du restaurant.

Un site statique ne peut pas envoyer d’e-mail tout seul.

## 6. Commande et livraison à domicile

Dans la section **Commander**, le client peut choisir :

- Retrait au bistrot.
- Livraison à domicile.

Lorsque **Livraison** est sélectionné, le champ **Adresse de livraison** apparaît automatiquement et devient obligatoire. Le client peut y inscrire :

```text
Numéro et rue, complément éventuel, code postal, ville
```

Il faut encore définir avec le restaurant :

- Zone de livraison.
- Frais de livraison.
- Montant minimum de commande.
- Créneaux disponibles.
- Jours de livraison.
- Service qui recevra les commandes.
- Moyen de paiement accepté.

Le panier actuel est une interface de démonstration côté navigateur. Pour vendre réellement, connecter le formulaire à un outil de commande ou à un backend. Ajouter un paiement uniquement après validation du restaurant.

## 7. Formulaire de contact

Dans la section `id="contact"`, remplacer :

```text
[À REMPLACER : identifiant-contact]
```

par l’identifiant Formspree du formulaire de contact.

Ce formulaire peut servir pour :

- Repas de groupe.
- Questions sur les allergènes.
- Privatisation.
- Demandes de partenariat.
- Questions générales.

## 8. Avis clients

Les avis présents dans la page sont volontairement des marqueurs :

```text
[À REMPLACER : avis client vérifié]
```

Ne jamais publier un avis inventé. Pour chaque avis réel, demander l’autorisation de l’auteur et renseigner :

- Texte exact de l’avis.
- Prénom ou nom affiché.
- Ville, si autorisée.
- Source : Google, TripAdvisor, livre d’or, e-mail, etc.
- Date si elle est utile.

## 9. Visuels et images

La version actuelle utilise une illustration CSS pour le hero. Elle ne dépend d’aucune image Gemini et ne risque donc pas de disparaître à cause d’une URL externe.

Si le client veut des photos :

- Utiliser des fichiers locaux dans `images/`.
- Préférer le format WebP.
- Prévoir une image hero d’environ 1600 × 1000 px.
- Prévoir des photos de plats d’environ 1200 × 900 px.
- Ajouter un texte `alt` décrivant réellement chaque photo.
- Vérifier les droits d’utilisation.
- Garder les crédits si la licence l’exige.

Sources possibles : Unsplash, Pexels, Pixabay, Freepik ou photos fournies par le restaurant. Vérifier la licence de chaque fichier. Pour refaire une image générée par Gemini, fournir le fichier concerné et préciser le style souhaité ; il ne faut pas remplacer une image sans vérifier les droits et le brief visuel.

## 10. Mise en ligne chez le client

### Option recommandée

1. Le client achète un nom de domaine.
2. Le client choisit un hébergeur statique : Netlify, Cloudflare Pages, GitHub Pages ou hébergement de son registrar.
3. Importer le dossier du site.
4. Configurer le domaine personnalisé.
5. Remplacer le domaine dans :
   - `canonical` dans `index.html` ;
   - les balises Open Graph ;
   - `robots.txt` ;
   - `sitemap.xml`.
6. Tester le site sur mobile.
7. Tester les trois parcours : réservation, commande, contact.

Vérifier les conditions, limites et tarifs du plan gratuit de l’hébergeur choisi.

## 11. Contrôle avant livraison

- [ ] Aucun texte `[À REMPLACER]` visible.
- [ ] Aucun prix `[XX €]` restant.
- [ ] Adresse et téléphone corrects.
- [ ] Horaires corrects.
- [ ] Formulaire de réservation testé.
- [ ] Formulaire de commande testé.
- [ ] Adresse obligatoire pour une livraison.
- [ ] Formulaire de contact testé.
- [ ] Prix visibles identiques aux prix techniques du panier.
- [ ] Avis clients réels et autorisés.
- [ ] Mentions légales complétées.
- [ ] Politique de confidentialité complétée.
- [ ] Favicon et logo validés.
- [ ] Site testé sur téléphone, tablette et ordinateur.
- [ ] Aucun défilement horizontal.
- [ ] Domaine configuré.

## 12. Ce qui n’est pas encore inclus

- Paiement en ligne.
- Gestion automatique des stocks.
- Gestion des réservations en temps réel.
- Tableau de bord administrateur.
- Calcul automatique des frais de livraison.
- Synchronisation avec Google, Uber Eats ou Deliveroo.

Ces fonctionnalités doivent être ajoutées avec l’accord du client et selon les outils qu’il utilise réellement.
