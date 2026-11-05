# Cahier des charges — « Frigo Festin »

> Application de suggestion de repas à partir des ingrédients disponibles dans le frigo.
> Version 1.0 — 5 novembre 2026
> Ce document sert de référence unique pour la conception et le développement de l'application.

---

## 1. Contexte et objectifs

### 1.1 Contexte
L'utilisateur ouvre son frigo, voit des ingrédients, et ne sait pas quoi cuisiner. Il est **grand mangeur** : il veut des repas copieux, rassasiants, et beaucoup d'idées différentes.

### 1.2 Objectifs
| # | Objectif | Indicateur de réussite |
|---|----------|------------------------|
| O1 | Sélectionner rapidement ce que contient le frigo, de façon visuelle (photos) | Sélection de 10 ingrédients en moins de 30 s |
| O2 | Obtenir **beaucoup** d'idées de repas réalisables | ≥ 20 suggestions pour une sélection de 8 ingrédients courants |
| O3 | Disposer d'une base de données **très large** | ≥ 600 ingrédients et ≥ 1 500 recettes au lancement |
| O4 | Privilégier les repas copieux | Filtre et tri « copieux » (calories / protéines par portion) |
| O5 | Fonctionner sur téléphone, même hors connexion | Application installable (PWA), utilisable sans réseau |

### 1.3 Nom provisoire
**Frigo Festin** (modifiable).

---

## 2. Périmètre

### 2.1 Inclus (V1)
- Catalogue d'ingrédients avec photos, classés par catégories.
- Sélection « Mon frigo » (persistée sur l'appareil).
- Moteur de suggestion de recettes basé sur les ingrédients sélectionnés.
- Fiche recette complète (photo, ingrédients, étapes, temps, portions, valeurs nutritionnelles estimées).
- Filtres et tri (type de repas, temps, difficulté, régime, copieux…).
- Favoris et historique.
- Ajustement du nombre de portions (avec mode « grand mangeur »).
- Liste de courses générée à partir des ingrédients manquants.
- Mode hors ligne, interface en français.

### 2.2 Exclus (V1) — pistes pour plus tard
- Comptes utilisateurs / synchronisation cloud.
- Reconnaissance d'ingrédients par photo (appareil photo + IA).
- Scan de codes-barres.
- Planning de repas sur la semaine.
- Partage social, commentaires, notes communautaires.

---

## 3. Utilisateur cible et cas d'usage

**Persona** : adulte, gros appétit, cuisine à la maison, veut de l'inspiration rapide sans aller faire les courses.

**Cas d'usage principaux**
1. *« J'ai des œufs, des pommes de terre, du fromage et des oignons, je mange quoi ce soir ? »* → l'utilisateur coche ses ingrédients, l'appli propose tortilla, gratin, omelette paysanne, rösti…
2. *« Je veux un plat bien copieux en moins de 30 min »* → filtres « copieux » + « ≤ 30 min ».
3. *« Il me manque juste un ingrédient ? »* → l'appli affiche les recettes à 1 ou 2 ingrédients manquants et permet de les ajouter à la liste de courses.
4. *« Je refais le même plat que la semaine dernière »* → favoris / historique.

---

## 4. Exigences fonctionnelles

### F1 — Catalogue d'ingrédients
- **F1.1** Chaque ingrédient s'affiche sous forme de **carte avec photo** et nom en français.
- **F1.2** Ingrédients regroupés par **catégories** (onglets ou sections) :
  Viandes · Volailles · Poissons & fruits de mer · Œufs & produits laitiers · Fromages · Légumes · Fruits · Féculents (pâtes, riz, pommes de terre…) · Légumineuses · Pains & pâtes à tarte · Charcuterie · Herbes & aromates · Épices · Sauces & condiments · Conserves · Surgelés · Fruits secs & graines · Produits sucrés · Boissons de cuisine (vin, bouillon, lait végétal…).
- **F1.3** **Recherche instantanée** par nom avec tolérance aux fautes et aux accents (« creme » trouve « crème », « tomates » trouve « tomate »), et synonymes (« patate » → « pomme de terre », « steak haché » → « bœuf haché »).
- **F1.4** Section « Fréquents » : ingrédients les plus souvent sélectionnés par l'utilisateur.
- **F1.5** Si une photo n'est pas disponible, affichage d'un visuel de remplacement (emoji ou pictogramme de la catégorie).

### F2 — Mon frigo (sélection)
- **F2.1** Un appui sur une carte ingrédient la sélectionne / désélectionne (retour visuel clair : coche, bordure colorée).
- **F2.2** Un compteur et une barre « Mon frigo » affichent les ingrédients sélectionnés ; chacun peut être retiré d'un appui.
- **F2.3** La sélection est **sauvegardée automatiquement** sur l'appareil et restaurée à la réouverture.
- **F2.4** Bouton « Tout vider ».
- **F2.5** **Placard de base** : liste d'ingrédients considérés comme toujours disponibles (sel, poivre, huile, beurre, farine, sucre, eau…). Paramétrable par l'utilisateur. Ces ingrédients ne comptent jamais comme « manquants ».

### F3 — Moteur de suggestion de repas
- **F3.1** Bouton principal « Trouver des repas » (visible dès qu'au moins 1 ingrédient est sélectionné).
- **F3.2** Résultats répartis en trois groupes :
  1. **Réalisables maintenant** — tous les ingrédients requis sont disponibles (frigo + placard).
  2. **Presque** — il manque 1 ou 2 ingrédients (liste des manquants affichée sur la carte).
  3. **Pour s'inspirer** — il manque 3+ ingrédients mais la recette utilise une bonne part du frigo.
- **F3.3** Score de pertinence (voir §6) qui ordonne les résultats.
- **F3.4** Ingrédients **optionnels** d'une recette : ne bloquent jamais la recette, mais augmentent son score s'ils sont présents.
- **F3.5** **Substitutions** : un ingrédient peut être remplacé par un équivalent (ex. crème fraîche ↔ crème liquide, emmental ↔ gruyère ↔ comté, lardons ↔ bacon, échalote ↔ oignon). Un ingrédient substitué compte comme présent, avec la mention « remplace X par Y ».
- **F3.6** Objectif de volume : afficher **le plus de suggestions possible** (pagination / défilement infini), jamais d'écran vide sans proposition alternative.
- **F3.7** Bouton « Surprends-moi » : propose une recette réalisable au hasard.

### F4 — Filtres et tri
- **F4.1** Type de repas : petit-déjeuner, entrée, plat, accompagnement, dessert, goûter, apéro.
- **F4.2** Temps total : ≤ 15 min, ≤ 30 min, ≤ 1 h, sans limite.
- **F4.3** Difficulté : facile, moyen, difficile.
- **F4.4** Régimes : végétarien, végan, sans gluten, sans lactose, sans porc, halal-compatible.
- **F4.5** **Copieux** : recettes ≥ 700 kcal par portion standard ou ≥ 35 g de protéines.
- **F4.6** Cuisine du monde : française, italienne, mexicaine, asiatique, indienne, orientale, américaine, etc.
- **F4.7** Équipement : poêle, four, casserole, micro-ondes, airfryer, cocotte-minute, barbecue.
- **F4.8** Tri : pertinence (défaut), le plus copieux, le plus rapide, le moins d'ingrédients manquants.

### F5 — Fiche recette
- **F5.1** Photo du plat, titre, cuisine, type, temps (préparation + cuisson), difficulté.
- **F5.2** Liste des ingrédients avec quantités, chacun marqué ✅ « dans mon frigo », 🟡 « substitution » ou ❌ « manquant ».
- **F5.3** Étapes numérotées, lisibles en cuisine (gros texte, écran maintenu allumé si le navigateur le permet).
- **F5.4** **Sélecteur de portions** (1 à 12) recalculant les quantités, avec un mode **« Grand mangeur » (×1,5 par portion)** activable par défaut dans les réglages.
- **F5.5** Valeurs nutritionnelles estimées par portion : kcal, protéines, glucides, lipides.
- **F5.6** Bouton « Ajouter les manquants à la liste de courses ».
- **F5.7** Bouton favori ❤️ et bouton « Je l'ai cuisiné » (alimente l'historique).
- **F5.8** Suggestions d'accompagnement pour compléter le repas (ex. plat + féculent + dessert), utiles pour un grand appétit.

### F6 — Favoris, historique, liste de courses
- **F6.1** Écran Favoris.
- **F6.2** Écran Historique (« cuisiné le … »).
- **F6.3** Liste de courses : ingrédients regroupés par catégorie, cases à cocher, suppression, et bouton « J'ai acheté » qui ajoute directement les ingrédients cochés à Mon frigo.

### F7 — Réglages
- Mode grand mangeur (on/off, coefficient).
- Nombre de portions par défaut.
- Régimes et allergies permanents (exclusion automatique des recettes incompatibles).
- Ingrédients détestés (exclusion).
- Placard de base.
- Thème clair / sombre (suit le système par défaut).
- Réinitialisation des données.

---

## 5. Base de données

### 5.1 Volumétrie cible
| Donnée | Lancement (V1) | Objectif à terme |
|--------|----------------|------------------|
| Ingrédients | **≥ 600** | 1 000+ |
| Recettes | **≥ 1 500** | 5 000+ |
| Photos d'ingrédients | 100 % des ingrédients (photo ou visuel de secours) | — |
| Photos de recettes | le plus possible, visuel de secours sinon | — |

Les données doivent couvrir un large éventail : cuisine française du quotidien, plats familiaux copieux, cuisine du monde, recettes rapides, plats mijotés, petits-déjeuners salés et sucrés, desserts.

### 5.2 Modèle de données

**Ingredient**
```ts
{
  id: string;              // slug unique, ex. "pomme-de-terre"
  name: string;            // "Pomme de terre"
  plural?: string;         // "Pommes de terre"
  synonyms: string[];      // ["patate", "pdt"]
  category: CategoryId;    // "feculents"
  image: string;           // chemin ou URL de la photo
  emoji?: string;          // visuel de secours "🥔"
  isPantryDefault: boolean;// fait partie du placard de base par défaut
  diet: {                  // propriétés pour les filtres de régime
    vegetarian: boolean; vegan: boolean; glutenFree: boolean;
    lactoseFree: boolean; pork: boolean;
  };
  nutritionPer100g?: { kcal: number; protein: number; carbs: number; fat: number };
  substitutes: string[];   // ids d'ingrédients équivalents
}
```

**Recipe**
```ts
{
  id: string;
  title: string;
  image?: string;
  cuisine: CuisineId;
  mealTypes: MealType[];   // ["plat"]
  prepMinutes: number;
  cookMinutes: number;
  difficulty: "facile" | "moyen" | "difficile";
  servings: number;        // portions de base
  equipment: EquipmentId[];
  ingredients: {
    ingredientId: string;
    quantity?: number;
    unit?: "g" | "kg" | "ml" | "cl" | "l" | "pièce" | "c.à.s" | "c.à.c" | "pincée" | "tranche" | "gousse" | "boîte";
    note?: string;         // "coupé en dés"
    optional: boolean;
  }[];
  steps: string[];
  nutritionPerServing?: { kcal: number; protein: number; carbs: number; fat: number };
  tags: string[];          // ["copieux", "réconfortant", "batch-cooking"]
  pairings?: string[];     // ids de recettes d'accompagnement suggérées
}
```

Les régimes d'une recette (végétarien, sans gluten…) sont **calculés** à partir de ses ingrédients obligatoires, pas saisis à la main, pour éviter les incohérences.

### 5.3 Sources et constitution des données
1. **Ingrédients** : liste constituée et normalisée en français ; photos issues de banques libres de droits (Wikimedia Commons, TheMealDB ingredient images, Open Food Facts — licences compatibles à vérifier) ou générées ; emoji de secours systématique.
2. **Recettes** : constituées par génération structurée + relecture (recettes classiques du domaine public — une liste d'ingrédients et des étapes ne sont pas protégées, mais aucun texte ne sera copié mot pour mot d'un site), complétées par des sources ouvertes (ex. TheMealDB, traduites et normalisées).
3. **Nutrition** : estimée à partir des valeurs pour 100 g des ingrédients (table type CIQUAL de l'Anses) multipliées par les quantités.
4. Toutes les données sont stockées dans des fichiers **JSON versionnés** dans le dépôt (`data/ingredients.json`, `data/recipes/*.json`), générés/validés par des scripts.

### 5.4 Qualité des données (contrôles automatiques)
Un script de validation doit vérifier, à chaque modification :
- unicité des `id` ;
- chaque `ingredientId` d'une recette existe dans le catalogue ;
- chaque ingrédient a une catégorie valide et une image ou un emoji ;
- chaque recette a au moins 2 ingrédients obligatoires et 1 étape ;
- substitutions réciproques et pointant vers des ids existants ;
- pas de recette en double (titre + ingrédients identiques).

---

## 6. Algorithme de suggestion

Entrées : `F` = ingrédients du frigo, `P` = placard de base, réglages (régimes, exclusions).

Pour chaque recette `R` (après exclusion des recettes incompatibles avec les régimes / ingrédients détestés) :

1. `requis` = ingrédients obligatoires de `R`.
2. Un ingrédient est **disponible** s'il est dans `F ∪ P`, ou si l'un de ses substituts y est (marqué « substitution »).
3. `manquants` = requis non disponibles.
4. `utilisés_frigo` = ingrédients de `R` (obligatoires + optionnels) présents dans `F` (le placard ne compte pas : on veut valoriser ce que l'utilisateur a vraiment).
5. **Score** :
   ```
   couverture   = (requis disponibles) / (nb requis)
   usage_frigo  = utilisés_frigo / max(1, |F|)
   score = 100 × couverture
         +  30 × usage_frigo
         +   5 × (optionnels présents)
         -  25 × (nb manquants)
         -   3 × (nb substitutions)
         +  10 si tag "copieux" et mode grand mangeur actif
   ```
6. Classement en groupes (§F3.2) selon `nb manquants` (0 / 1–2 / 3+ avec `utilisés_frigo ≥ 2`), puis tri par score décroissant (ou critère choisi par l'utilisateur).

Performance : un **index inversé** `ingrédient → recettes` est construit au chargement pour ne scorer que les recettes contenant au moins un ingrédient du frigo. Objectif : < 100 ms pour 5 000 recettes sur un téléphone milieu de gamme.

---

## 7. Exigences non fonctionnelles

| Domaine | Exigence |
|---------|----------|
| Plateforme | Application web **mobile-first**, installable (**PWA**), compatible iOS Safari 16+, Android Chrome, navigateurs de bureau récents |
| Hors ligne | Toutes les données et l'interface disponibles sans réseau après la première visite (service worker) |
| Performance | Premier affichage < 2 s en 4G ; images en WebP, chargement différé (lazy-loading), miniatures ≤ 30 Ko |
| Accessibilité | Contrastes WCAG AA, zones tactiles ≥ 44 px, textes alternatifs sur les photos, navigation clavier |
| Langue | Français (structure prête pour d'autres langues) |
| Données personnelles | Aucune donnée envoyée sur un serveur : tout reste en local (localStorage / IndexedDB) |
| Maintenabilité | TypeScript strict, linting, tests automatisés, données validées par script |
| Légal | Images et données sous licences compatibles, crédits listés dans une page « À propos » |

---

## 8. Architecture technique

### 8.1 Choix technologiques
- **Front-end** : React 18 + TypeScript + Vite.
- **Style** : Tailwind CSS.
- **État** : Zustand (avec persistance locale).
- **Routage** : React Router.
- **Recherche floue** : Fuse.js (ou normalisation maison accents/pluriels).
- **PWA** : vite-plugin-pwa (service worker, manifeste, icônes).
- **Tests** : Vitest (unitaires — moteur de suggestion, validation des données) + Playwright (parcours de bout en bout).
- **Hébergement** : site statique (Vercel, Netlify ou GitHub Pages).

Pas de back-end en V1 : la base de données est embarquée sous forme de JSON statiques, découpés et chargés à la demande si la taille l'exige.

### 8.2 Arborescence prévue
```
/
├─ docs/CAHIER_DES_CHARGES.md
├─ data/
│  ├─ categories.json
│  ├─ ingredients.json
│  └─ recipes/            (un fichier par cuisine ou par lot)
├─ public/images/
│  ├─ ingredients/        (photos WebP)
│  └─ recipes/
├─ scripts/
│  ├─ validate-data.ts    (contrôles §5.4)
│  └─ build-index.ts      (index inversé, stats)
└─ src/
   ├─ domain/             (types, moteur de suggestion, portions, nutrition)
   ├─ data/               (chargement des JSON)
   ├─ store/              (frigo, favoris, historique, courses, réglages)
   ├─ components/         (IngredientCard, RecipeCard, Filters, …)
   ├─ pages/              (Frigo, Résultats, Recette, Favoris, Courses, Réglages)
   └─ main.tsx
```

---

## 9. Écrans et parcours

1. **Mon frigo** (écran d'accueil)
   Barre de recherche · onglets de catégories · grille de cartes photo (2 colonnes mobile, 4–6 bureau) · barre fixe en bas « 🧊 12 ingrédients — Trouver des repas ».
2. **Résultats**
   Compteurs par groupe (Réalisables / Presque / Inspiration) · chips de filtres · liste de cartes recettes (photo, titre, temps, kcal, badge « copieux », pastilles des manquants).
3. **Fiche recette** (§F5).
4. **Favoris**, **Historique**.
5. **Liste de courses**.
6. **Réglages**.

Navigation par barre d'onglets en bas : Frigo · Repas · Favoris · Courses · Réglages.

Charte graphique : chaleureuse et appétissante (tons orange/tomate et vert herbe), photos mises en avant, typographie lisible, coins arrondis, mode sombre.

---

## 10. Critères d'acceptation (recette)

- [ ] Le catalogue contient ≥ 600 ingrédients, tous avec une photo ou un visuel de secours, et passe le script de validation.
- [ ] La base contient ≥ 1 500 recettes valides.
- [ ] Rechercher « patate » affiche « Pomme de terre ».
- [ ] La sélection du frigo est conservée après fermeture et réouverture de l'appli.
- [ ] Avec {œufs, pommes de terre, oignon, fromage râpé} + placard par défaut, au moins 5 recettes « Réalisables maintenant » sont proposées.
- [ ] Avec 8 ingrédients courants, au moins 20 suggestions au total.
- [ ] Une recette avec un ingrédient manquant apparaît dans « Presque » avec le nom de l'ingrédient manquant.
- [ ] Une substitution (ex. gruyère à la place d'emmental) est reconnue et signalée.
- [ ] Le filtre végétarien n'affiche aucune recette contenant viande ou poisson.
- [ ] Le mode grand mangeur multiplie les quantités par 1,5.
- [ ] Les ingrédients manquants peuvent être envoyés dans la liste de courses, puis « achetés » vers le frigo.
- [ ] L'appli fonctionne en mode avion après une première visite.
- [ ] Le calcul des suggestions prend < 100 ms sur la base complète.
- [ ] Tests unitaires du moteur et tests E2E du parcours principal au vert.

---

## 11. Planning de réalisation

| Lot | Contenu |
|-----|---------|
| L1 — Socle | Projet Vite/React/TS, Tailwind, routage, PWA, types du domaine |
| L2 — Données | Catégories, ingrédients (+ photos / emoji), recettes, scripts de validation et d'index |
| L3 — Mon frigo | Catalogue, recherche, sélection persistée, placard de base |
| L4 — Moteur | Algorithme de suggestion, substitutions, tests unitaires |
| L5 — Résultats & fiche recette | Groupes, filtres, tri, portions, nutrition |
| L6 — Extras | Favoris, historique, liste de courses, réglages, « Surprends-moi » |
| L7 — Finition | Accessibilité, performance, mode hors ligne, tests E2E, déploiement |

---

## 12. Évolutions envisagées (V2+)
- Reconnaissance des ingrédients par photo du frigo (IA de vision).
- Scan de codes-barres (Open Food Facts).
- Gestion des dates de péremption et priorisation des produits à consommer vite.
- Planificateur de repas hebdomadaire et batch cooking.
- Synchronisation multi-appareils avec compte utilisateur.
- Génération de recettes à la volée par IA quand la base ne suffit pas.
