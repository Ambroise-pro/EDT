# 🚀 Déploiement sur Vercel

Cette application est prête à être déployée sur Vercel.

## Prérequis

- Compte Vercel (gratuit) : https://vercel.com
- Git et GitHub (pour les push)

## Option 1 : Déploiement via Vercel CLI (Recommandé)

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
```

### 3. Déployer
```bash
vercel
```

La CLI guidera le processus et affichera l'URL du déploiement.

## Option 2 : Déploiement via GitHub (Automatisé)

### 1. Pousser le code sur GitHub
```bash
git push -u origin claude/app-vercel-deployment-3sf862
```

### 2. Créer le projet sur Vercel
- Aller à https://vercel.com/new
- Connecter votre compte GitHub
- Sélectionner ce repository
- Vercel détectera automatiquement que c'est un site statique
- Cliquer sur "Deploy"

### 3. Configuration automatique
- Chaque `git push` sur votre branche déploiera automatiquement
- Les URL de preview seront générées automatiquement

## Configuration du Firestore

⚠️ **Important** : Vérifiez que vos règles de sécurité Firestore sont correctement configurées avant la production.

Actuellement, les règles permettent l'accès public. Pour sécuriser :

1. Aller à Firebase Console
2. Firestore Database → Règles
3. Remplacer par des règles restrictives :

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentification requise pour tout
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Après le déploiement

Votre application sera accessible à une URL Vercel.

- **Production** : `https://[your-project].vercel.app`
- **Preview** : Générées automatiquement pour chaque PR

## Troubleshooting

Si l'app ne se charge pas :

1. Vérifier les logs dans le dashboard Vercel
2. S'assurer que le Firebase config est correct dans `app.js`
3. Vérifier que les CORS sont correctement configurés sur Firestore
