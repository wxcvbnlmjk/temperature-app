# Synthèse de l'application de météo

## Structure du projet

Le projet est une application de météo construite avec **React**, **TypeScript**, et **TailwindCSS**. Elle utilise **Vite** comme outil de build et **Recharts** pour les graphiques. Voici la structure du projet :

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

## Principales fonctionnalités

### 1. **Affichage des données météo**
   - L'application récupère les données météo via l'API **Open-Meteo**.
   - Les données incluent la température, les précipitations, la vitesse du vent, les rafales, la couverture nuageuse, et la neige.
   - Les données sont affichées sous forme de graphiques interactifs avec **Recharts**.

### 2. **Recherche de ville**
   - L'utilisateur peut rechercher une ville pour afficher les données météo correspondantes.
   - La recherche utilise l'API **Nominatim** pour obtenir les coordonnées GPS de la ville.
   - L'altitude de la ville est également récupérée via l'API **Open-Meteo**.

### 3. **Filtrage par date**
   - L'utilisateur peut filtrer les données météo par date en utilisant un calendrier interactif.
   - Les dates de début et de fin peuvent être sélectionnées pour afficher les données correspondantes.

### 4. **Thème sombre/clair**
   - L'application propose un mode sombre et un mode clair, gérés par le composant **ThemeProvider**.
   - Le thème est persistant grâce au stockage local.

### 5. **Composants UI réutilisables**
   - L'application utilise des composants UI réutilisables tels que des boutons, des calendriers, des cartes, des menus déroulants, etc.
   - Ces composants sont stylisés avec **TailwindCSS** et **shadcn/ui**.

## Technologies utilisées

- **React** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur.
- **TypeScript** : Ajoute des types statiques à JavaScript pour une meilleure maintenabilité.
- **TailwindCSS** : Framework CSS utilitaire pour styliser l'application.
- **Recharts** : Bibliothèque pour la création de graphiques interactifs.
- **Vite** : Outil de build rapide pour les applications modernes.
- **Open-Meteo** : API pour les données météo.
- **Nominatim** : API pour la géolocalisation des villes.

## Configuration

### **TailwindCSS**
- Le fichier `tailwind.config.js` configure les couleurs, les bordures, et les animations.
- Les couleurs sont définies avec des variables CSS pour une gestion facile du thème sombre/clair.

### **TypeScript**
- Plusieurs fichiers de configuration TypeScript (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) sont utilisés pour gérer les types et les chemins d'importation.

### **ESLint**
- Le fichier `eslint.config.js` configure les règles de linting pour TypeScript et React.

### **Vite**
- Le fichier `vite.config.ts` configure les alias d'importation et le serveur de développement.

## Composants clés

### **App.tsx**
- Le composant principal de l'application.
- Gère la récupération des données météo, la recherche de ville, et l'affichage des graphiques.

### **ThemeProvider.tsx**
- Gère le thème de l'application (sombre/clair).
- Utilise le stockage local pour persister le thème choisi par l'utilisateur.

### **Chart.tsx**
- Composant pour afficher les graphiques météo avec **Recharts**.
- Inclut des tooltips personnalisés pour afficher des informations détaillées.

### **ModeToggle.tsx**
- Composant pour basculer entre les thèmes sombre et clair.

## Conclusion

Cette application de météo est un exemple moderne d'utilisation de React avec TypeScript et TailwindCSS. Elle intègre des API externes pour récupérer des données en temps réel et propose une interface utilisateur interactive et personnalisable. La structure du projet est bien organisée, avec des composants réutilisables et une configuration robuste pour le développement et le déploiement.
