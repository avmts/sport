# Mon Journal Sportif

Une application web moderne et conviviale pour suivre vos séances de sport.

## Fonctionnalités

- **Calendrier Interactif** : Visualisez vos jours d'entraînement en un coup d'œil.
- **Journal de Séance** : Enregistrez vos exercices (séries, répétitions), vos horaires et votre ressenti.
- **Synchronisation Calendrier** : Exportez vos séances vers votre calendrier personnel (Google Calendar, Outlook, Apple Calendar) via le bouton d'ajout au calendrier (format .ics).
- **Partage Facile** : Copiez un résumé formaté de votre séance pour le partager avec vos amis ou votre coach.
- **100% Local** : Toutes vos données sont stockées dans votre navigateur. Rien n'est envoyé sur un serveur distant.

## Utilisation

Cette application est conçue pour fonctionner directement dans le navigateur sans nécessiter de serveur complexe une fois installée.

### Option 1 : Utilisation directe (Recommandé pour l'utilisation quotidienne)

1. Ouvrez le dossier `dist`.
2. Double-cliquez sur le fichier `index.html`.
3. L'application s'ouvrira dans votre navigateur web par défaut.

Note : Assurez-vous d'avoir exécuté `npm run build` au moins une fois si le dossier `dist` n'existe pas.

### Option 2 : Développement

Pour modifier le code et développer :

```bash
npm install
npm run dev
```

Pour générer la version utilisable (dist) :

```bash
npm run build
```

## Technologies

- React
- Tailwind CSS
- Date-fns
- Lucide React (Icônes)
