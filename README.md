# Documentation de l'Application Météo

Cette documentation décrit la structure et le contenu de l'application météo développée avec **React**, **TypeScript**, **Vite**, et **Tailwind CSS**. L'application permet de visualiser les données météorologiques en temps réel, y compris la température, les précipitations, la vitesse du vent, et plus encore.

---

## Structure du Projet

```
wxcvbnlmjk-temperature-app.git/
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.app.tsbuildinfo
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.node.tsbuildinfo
├── vite.config.ts
├── public/
│   └── weather/
└── src/
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    ├── components/
    │   └── ui/
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── chart.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── mode-toggle.tsx
    │       ├── popover.tsx
    │       ├── select.tsx
    │       └── theme-provider.tsx
    └── lib/
        └── utils.ts
```

---

## Description des Fichiers

### `README.md`
Contient une brève description du projet.

### `components.json`
Configure les composants UI avec des options telles que le style, les alias, et la bibliothèque d'icônes.

### `eslint.config.js`
Configuration d'ESLint pour le projet, incluant des règles pour React et TypeScript.

### `index.html`
Le point d'entrée HTML de l'application. Il inclut le conteneur racine pour l'application React.

### `package.json`
Contient les dépendances du projet et les scripts pour exécuter, construire, et linter l'application.

### `postcss.config.js`
Configuration de PostCSS pour le projet, principalement utilisé pour Tailwind CSS.

### `tailwind.config.js`
Configuration de Tailwind CSS, incluant les couleurs personnalisées et les plugins.

### `tsconfig.app.json` et `tsconfig.node.json`
Configurations TypeScript pour l'application et les fichiers Node.js respectivement.

### `vite.config.ts`
Configuration de Vite, incluant les alias pour les imports et les options du serveur.

### `public/weather/`
Dossier contenant les icônes météorologiques utilisées dans l'application.

### `src/`
Dossier source contenant tous les fichiers React et les composants.

#### `App.css`
Styles CSS spécifiques à l'application.

#### `App.tsx`
Le composant principal de l'application. Il gère l'affichage des données météorologiques et les interactions utilisateur.

#### `index.css`
Styles globaux pour l'application, incluant les styles de base et les utilitaires Tailwind CSS.

#### `main.tsx`
Point d'entrée de l'application React. Il rend le composant `App` dans le conteneur racine.

#### `vite-env.d.ts`
Déclaration de types pour les variables d'environnement Vite.

#### `src/components/ui/`
Dossier contenant les composants UI réutilisables, tels que les boutons, les calendriers, les cartes, etc.

#### `src/lib/utils.ts`
Fichier utilitaire contenant des fonctions communes, comme la fusion de classes avec `clsx` et `tailwind-merge`.

---

## Fonctionnalités Principales

- **Affichage des Données Météorologiques** : L'application récupère les données météorologiques via l'API Open-Meteo et les affiche sous forme de graphiques.
- **Recherche de Ville** : Les utilisateurs peuvent rechercher une ville pour afficher les données météorologiques correspondantes.
- **Sélection de Dates** : Les utilisateurs peuvent sélectionner une plage de dates pour afficher les données météorologiques historiques ou prévues.
- **Thème Sombre/Clair** : L'application prend en charge les thèmes sombre et clair, avec un basculement facile entre les deux.

---

## Dépendances

- **React** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur.
- **TypeScript** : Sur-ensemble typé de JavaScript.
- **Vite** : Outil de build rapide pour les applications modernes.
- **Tailwind CSS** : Framework CSS utilitaire pour la conception rapide d'interfaces utilisateur.
- **Recharts** : Bibliothèque de graphiques pour React.
- **Radix UI** : Bibliothèque de composants UI accessibles et personnalisables.

---

## Scripts Disponibles

- `dev` : Lance l'application en mode développement.
- `build` : Construit l'application pour la production.
- `lint` : Exécute ESLint pour vérifier le code.
- `preview` : Prévient l'application construite localement.

---

## Installation et Exécution

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/wxcvbnlmjk-temperature-app.git
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur et accédez à `http://localhost:5173`.

---

## Conclusion

Cette application météo est un exemple de la puissance de **React**, **TypeScript**, et **Tailwind CSS** pour créer des interfaces utilisateur modernes et réactives. Elle démontre également l'intégration d'API externes pour récupérer et afficher des données en temps réel.
