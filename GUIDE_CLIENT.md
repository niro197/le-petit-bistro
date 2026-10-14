# Guide client — Studio Projet

Ce site est un portfolio commercial pour vendre des projets digitaux. Il ne s’agit plus d’un site de restaurant.

## 1. Ce que le site vend

La page présente des bases de projets que vous pouvez vendre ou personnaliser :

- Sites vitrine.
- Landing pages.
- Portfolios.
- Identités visuelles.
- Boutiques en ligne.

Chaque carte de projet peut être remplacée par un vrai projet, avec son nom, ses images, sa description et ce qui est inclus.

## 2. Les fichiers importants

| Fichier | Utilisation |
|---|---|
| `index.html` | Tous les textes, projets, formulaires et liens |
| `css/style.css` | Couleurs, formes, tailles et responsive |
| `js/main.js` | Filtres, fenêtres de projet, menu et formulaire |
| `images/favicon.svg` | Icône du site |
| `mentions-legales.html` | Informations légales à compléter |
| `confidentialite.html` | Politique de confidentialité à compléter |
| `robots.txt` | Référencement |
| `sitemap.xml` | Référencement |

## 3. Première étape : remplacer les marqueurs

Dans Visual Studio Code, utiliser `Ctrl + Shift + F` et rechercher :

```text
[À REMPLACER
```

Remplacer chaque résultat par une vraie information.

À modifier en priorité :

- `[À REMPLACER : nom du studio]`
- `[À REMPLACER : e-mail]`
- `[À REMPLACER : téléphone]`
- `[À REMPLACER : ville]`
- `[À REMPLACER : délai]`
- `[À REMPLACER : année]`
- `[À REMPLACER : LinkedIn]`
- `[À REMPLACER : Instagram]`
- `[À REMPLACER : domaine]`
- `[À REMPLACER : identifiant-contact]`

Aucun marqueur ne doit rester visible avant de vendre le site.

## 4. Remplacer les projets

Les projets sont dans la section `id="projets"` du fichier `index.html`.

Pour chaque carte, modifier :

1. Le type : `Site vitrine`, `Identité de marque`, `Boutique en ligne`, etc.
2. Le nom du projet.
3. La description courte.
4. Le texte de la fenêtre interactive dans `projectData` dans `js/main.js`.
5. Le contenu inclus.
6. Le lien vers une démo ou vers le formulaire.

Les noms actuels comme `Le Petit Bistro`, `Atelier Matière` et `Nord & Forme` sont des exemples. Il faut les remplacer par vos propres projets ou les laisser clairement comme démos.

## 5. Ajouter vos images

Les visuels actuels du restaurant ont été supprimés de la page portfolio. Les aperçus des projets sont volontairement créés en CSS pour éviter les fichiers lourds et les droits incertains.

Pour ajouter une vraie image de projet :

```html
<img src="images/projet-client.webp" width="1200" height="800" loading="lazy" alt="Description précise du projet présenté">
```

Conseils :

- Utiliser WebP.
- Préparer une image d’environ 1200 × 800 px.
- Conserver les droits ou l’autorisation du client.
- Ajouter un `alt` descriptif.
- Ne pas utiliser une URL d’image trouvée au hasard.

## 6. Vendre un projet

Pour chaque projet, préparer une fiche commerciale :

- Nom du projet.
- Problème auquel il répond.
- Public visé.
- Fonctionnalités incluses.
- Ce qui est personnalisable.
- Délai estimé.
- Prix ou mention « sur devis ».
- Ce qui n’est pas inclus.
- Nombre de corrections prévues.
- Conditions de livraison.

Le site ne doit pas inventer de prix. Utiliser `Sur devis` tant que vos tarifs ne sont pas définis.

## 7. Formulaire de demande

Le formulaire se trouve dans la section `id="contact"`.

Remplacer :

```text
[À REMPLACER : identifiant-contact]
```

par l’identifiant Formspree réel.

Le formulaire demande :

- Nom.
- E-mail.
- Type de projet.
- Description et besoin.

Tester le formulaire avec une vraie adresse avant de vendre le site.

## 8. Mise en ligne

### GitHub Pages

1. Ouvrir le dépôt GitHub.
2. Aller dans **Settings → Pages**.
3. Choisir **GitHub Actions** comme source.
4. Ouvrir **Actions**.
5. Lancer le workflow de publication.
6. Vérifier l’adresse fournie par GitHub.

### Autres options

Le site peut aussi être déployé sur Netlify, Cloudflare Pages ou l’hébergement du client. Vérifier les limites et conditions du plan choisi.

## 9. Checklist avant vente

- [ ] Le titre du studio est correct.
- [ ] Le nom de domaine est correct.
- [ ] Les e-mails et liens sociaux fonctionnent.
- [ ] Les projets affichés sont réels ou clairement présentés comme démos.
- [ ] Les prix sont renseignés ou indiqués « Sur devis ».
- [ ] Le formulaire reçoit réellement les messages.
- [ ] Les mentions légales sont complétées.
- [ ] La politique de confidentialité est complétée.
- [ ] Le site fonctionne sur téléphone.
- [ ] Aucun `[À REMPLACER]` ne reste visible.
- [ ] Le lien GitHub Pages ou le domaine final a été testé.

## 10. Important

Ce site est un support commercial. Il ne remplace pas un contrat de vente, un devis, des conditions générales ou un avis juridique. Ajoutez vos conditions de paiement, de livraison et de propriété intellectuelle avant toute vente.
