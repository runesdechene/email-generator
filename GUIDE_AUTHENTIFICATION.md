# Guide de déploiement de l'authentification

## 📋 Vue d'ensemble

L'authentification a été intégrée à votre application Email Generator. Chaque utilisateur aura maintenant ses propres templates et projets.

## 🚀 Étapes de déploiement

### 1. Configuration de la base de données Supabase

**Exécutez le script SQL `SETUP_AUTH.sql` dans Supabase :**

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **SQL Editor**
4. Copiez le contenu de `SETUP_AUTH.sql`
5. Exécutez le script

**Ce script va :**

- Ajouter la colonne `user_id` aux tables `templates` et `projects`
- Activer Row Level Security (RLS)
- Créer les politiques pour que chaque utilisateur ne voie que ses données
- Créer un template par défaut pour chaque nouvel utilisateur

### 2. Activer l'authentification par email dans Supabase

1. Dans Supabase, allez dans **Authentication** → **Providers**
2. Activez **Email** si ce n'est pas déjà fait
3. Configurez les paramètres :
   - **Enable email confirmations** : Activé (recommandé)
   - **Secure email change** : Activé (recommandé)

### 3. Configurer les templates d'emails (optionnel)

Dans **Authentication** → **Email Templates**, vous pouvez personnaliser :

- Email de confirmation
- Email de réinitialisation de mot de passe
- Email de changement d'email

### 4. Mettre à jour les données existantes

**IMPORTANT** : Si vous avez déjà des templates et projets dans votre base de données, vous devez leur assigner un `user_id`.

**Option A** : Supprimer les données de test

```sql
DELETE FROM projects;
DELETE FROM templates;
```

**Option B** : Assigner les données à votre compte

```sql
-- Remplacez 'VOTRE_USER_ID' par votre vrai user_id après inscription
UPDATE templates SET user_id = 'VOTRE_USER_ID' WHERE user_id IS NULL;
UPDATE projects SET user_id = 'VOTRE_USER_ID' WHERE user_id IS NULL;
```

Pour trouver votre `user_id` :

1. Inscrivez-vous dans l'application
2. Dans Supabase, allez dans **Authentication** → **Users**
3. Copiez votre UUID

### 5. Déployer sur Netlify

Les modifications sont déjà dans le code. Il suffit de :

```bash
git add .
git commit -m "Add authentication system"
git push
```

Netlify va automatiquement redéployer l'application.

### 6. Tester l'authentification

1. Allez sur `https://emailgenerator.runesdechene.com`
2. Vous devriez voir la page de connexion
3. Créez un compte avec votre email
4. Vérifiez votre email pour confirmer (si activé)
5. Connectez-vous

## 🎯 Fonctionnalités implémentées

### ✅ Page de connexion/inscription

- Design moderne et responsive
- Validation des formulaires
- Messages d'erreur clairs
- Toggle entre connexion et inscription

### ✅ Protection de l'application

- Redirection automatique vers la page de connexion si non connecté
- Écran de chargement pendant la vérification de la session
- Persistance de la session (reste connecté après fermeture du navigateur)

### ✅ Isolation des données

- Chaque utilisateur voit uniquement ses templates
- Chaque utilisateur voit uniquement ses projets
- Impossible d'accéder aux données d'un autre utilisateur (RLS)

### ✅ Template par défaut

- Création automatique d'un template de démarrage pour chaque nouvel utilisateur

## 🔧 Modifications apportées au code

### Nouveaux fichiers créés :

- `src/contexts/AuthContext.tsx` - Contexte d'authentification
- `src/components/auth/AuthPage.tsx` - Page de connexion/inscription
- `src/components/auth/AuthGuard.tsx` - Protection des routes
- `SETUP_AUTH.sql` - Script de configuration de la base de données

### Fichiers modifiés :

- `src/App.tsx` - Intégration de AuthProvider et AuthGuard
- `src/types/supabase.ts` - Ajout de `user_id` aux interfaces
- `index.html` - Ajout de la police Lato (déjà fait)

### À faire manuellement :

- Modifier `src/hooks/useSupabase.ts` pour ajouter automatiquement `user_id` lors de la création de templates et projets

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS. Les politiques garantissent que :

- Un utilisateur ne peut voir que ses propres données
- Un utilisateur ne peut modifier que ses propres données
- Un utilisateur ne peut supprimer que ses propres données

### Authentification

- Mots de passe hashés par Supabase (bcrypt)
- Sessions sécurisées avec JWT
- Tokens de refresh automatiques

## 🆘 Dépannage

### Problème : "Cannot read properties of null"

**Solution** : Assurez-vous d'avoir exécuté le script `SETUP_AUTH.sql`

### Problème : "Row Level Security policy violation"

**Solution** : Vérifiez que les politiques RLS sont bien créées et que `user_id` est bien renseigné

### Problème : Email de confirmation non reçu

**Solution** :

1. Vérifiez vos spams
2. Dans Supabase, désactivez temporairement "Enable email confirmations" pour tester
3. Configurez un service SMTP personnalisé dans Supabase

### Problème : Impossible de créer un template

**Solution** : Modifiez `src/hooks/useSupabase.ts` pour ajouter `user_id` automatiquement (voir section suivante)

## 📝 Prochaines étapes recommandées

1. **Ajouter un bouton de déconnexion** dans la Navbar
2. **Modifier useSupabase.ts** pour gérer `user_id` automatiquement
3. **Ajouter une page de profil** pour gérer le compte utilisateur
4. **Implémenter la réinitialisation de mot de passe**
5. **Ajouter des limites** (nombre de templates/projets par utilisateur)

## 🎨 Personnalisation

### Changer les couleurs de la page de connexion

Modifiez `src/components/auth/AuthPage.tsx` :

- `bg-violet-600` → votre couleur principale
- `text-violet-600` → votre couleur de texte

### Changer le logo

Remplacez l'icône `Mail` par votre logo dans `AuthPage.tsx`

## 📊 Monitoring

Dans Supabase, vous pouvez :

- Voir tous les utilisateurs inscrits (**Authentication** → **Users**)
- Voir les logs d'authentification (**Authentication** → **Logs**)
- Gérer les sessions actives

---

**Besoin d'aide ?** Consultez la [documentation Supabase Auth](https://supabase.com/docs/guides/auth)
