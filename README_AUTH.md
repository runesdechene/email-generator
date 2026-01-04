# 🔐 Système d'authentification - Email Generator

## ✅ Ce qui a été fait

### 1. Infrastructure d'authentification

- ✅ Contexte Auth (`src/contexts/AuthContext.tsx`)
- ✅ Page de connexion/inscription (`src/components/auth/AuthPage.tsx`)
- ✅ Protection de l'application (`src/components/auth/AuthGuard.tsx`)
- ✅ Bouton de déconnexion dans la Navbar
- ✅ Script SQL de configuration (`SETUP_AUTH.sql`)

### 2. Modifications de la base de données

- ✅ Ajout de `user_id` aux tables `templates` et `projects`
- ✅ Row Level Security (RLS) configuré
- ✅ Politiques de sécurité créées
- ✅ Template par défaut pour nouveaux utilisateurs

### 3. Modifications du code

- ✅ Types TypeScript mis à jour avec `user_id`
- ✅ App.tsx enveloppé avec AuthProvider et AuthGuard
- ✅ Navbar avec bouton de déconnexion

## ⚠️ À FAIRE MANUELLEMENT

### 1. Exécuter le script SQL dans Supabase

**IMPORTANT** : Avant de déployer, vous devez :

1. Aller sur [supabase.com](https://supabase.com)
2. Ouvrir votre projet
3. Aller dans **SQL Editor**
4. Copier le contenu de `SETUP_AUTH.sql`
5. Exécuter le script

### 2. Modifier `src/hooks/useSupabase.ts`

Vous devez modifier les fonctions `createTemplate` et `createProject` pour ajouter automatiquement le `user_id`.

**Exemple pour createTemplate :**

```typescript
// Dans src/hooks/useSupabase.ts

export function useTemplates() {
  // ... code existant ...

  const createTemplate = async (
    template: Omit<
      GlobalStyleTemplate,
      "id" | "createdAt" | "updatedAt" | "user_id"
    >
  ) => {
    // Récupérer l'utilisateur actuel
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("templates")
      .insert([
        {
          ...template,
          user_id: user.id, // Ajouter automatiquement le user_id
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // ... reste du code ...
}
```

**Même chose pour createProject :**

```typescript
const createProject = async (
  project: Omit<EmailProject, "id" | "createdAt" | "updatedAt" | "user_id">
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        ...project,
        user_id: user.id, // Ajouter automatiquement le user_id
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### 3. Activer l'authentification par email dans Supabase

1. Dans Supabase : **Authentication** → **Providers**
2. Activez **Email**
3. Configurez les paramètres selon vos préférences

### 4. Gérer les données existantes

Si vous avez déjà des templates/projets :

**Option A** : Les supprimer

```sql
DELETE FROM projects;
DELETE FROM templates;
```

**Option B** : Les assigner à votre compte

```sql
-- Après inscription, récupérez votre user_id dans Authentication → Users
UPDATE templates SET user_id = 'VOTRE_USER_ID' WHERE user_id IS NULL;
UPDATE projects SET user_id = 'VOTRE_USER_ID' WHERE user_id IS NULL;
```

## 🚀 Déploiement

Une fois les étapes ci-dessus complétées :

```bash
git add .
git commit -m "Add authentication system"
git push
```

Netlify redéploiera automatiquement.

## 🎯 Fonctionnement

### Première visite

1. L'utilisateur arrive sur l'application
2. Il n'est pas connecté → redirection vers la page de connexion
3. Il peut créer un compte ou se connecter
4. Après connexion → accès à l'application

### Utilisateur connecté

- Voit uniquement ses templates
- Voit uniquement ses projets
- Peut se déconnecter via le bouton en bas de la Navbar

### Sécurité

- Row Level Security empêche l'accès aux données des autres utilisateurs
- Sessions persistantes (reste connecté)
- Mots de passe sécurisés par Supabase

## 📝 Prochaines améliorations possibles

1. **Page de profil** - Gérer email, mot de passe
2. **Réinitialisation de mot de passe** - Lien "Mot de passe oublié ?"
3. **Limites par utilisateur** - Nombre max de templates/projets
4. **Partage de templates** - Permettre le partage entre utilisateurs
5. **OAuth** - Connexion avec Google, GitHub, etc.

## 🆘 Support

Consultez `GUIDE_AUTHENTIFICATION.md` pour un guide détaillé et le dépannage.

---

**L'authentification est prête à être déployée !** 🎉
