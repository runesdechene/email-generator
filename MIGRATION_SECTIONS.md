# Migration: Renommer section_templates → sections

## 📋 Résumé

Renommage de la table `section_templates` en `sections` dans Supabase pour plus de clarté.

## ✅ Modifications effectuées dans le code

### Fichiers modifiés

1. **`src/services/supabase.service.ts`** ✅
   - Toutes les requêtes `.from('section_templates')` → `.from('sections')`
   - 4 méthodes mises à jour :
     - `getSectionTemplates()`
     - `createSectionTemplate()`
     - `updateSectionTemplate()`
     - `deleteSectionTemplate()`

### Nouveaux fichiers créés

1. **`RENAME_SECTION_TEMPLATES.sql`** - Script de migration à exécuter
2. **`SETUP_SECTIONS.sql`** - Nouveau script de setup (pour référence future)
3. **`MIGRATION_SECTIONS.md`** - Ce document

## 🚀 Étapes à suivre

### 1. Exécuter le script SQL dans Supabase

1. Ouvrez votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez le contenu de `RENAME_SECTION_TEMPLATES.sql`
4. Exécutez le script
5. Vérifiez le message de succès : "Migration terminée: section_templates -> sections"

### 2. Vérifier dans Supabase

1. Allez dans **Table Editor**
2. Vérifiez que la table `sections` existe
3. Vérifiez que la table `section_templates` n'existe plus
4. Vérifiez que les données sont toujours présentes dans `sections`

### 3. Tester l'application

1. Lancez l'application : `pnpm dev`
2. Vérifiez que les sections se chargent correctement
3. Testez l'ajout d'une section
4. Vérifiez qu'il n'y a pas d'erreurs dans la console

## 📝 Détails de la migration SQL

Le script effectue les actions suivantes :

1. **Renomme la table** : `section_templates` → `sections`
2. **Renomme l'index** : `idx_section_templates_name` → `idx_sections_name`
3. **Renomme la fonction** : `update_section_templates_updated_at()` → `update_sections_updated_at()`
4. **Recrée le trigger** avec le nouveau nom
5. **Met à jour les politiques RLS** avec les nouveaux noms

## ⚠️ Important

- **Aucune donnée n'est perdue** - c'est juste un renommage
- **Les RLS policies sont recréées** - les permissions restent identiques
- **Le code TypeScript a été mis à jour** - tout est synchronisé

## 🔄 Rollback (si nécessaire)

Si vous devez annuler la migration :

```sql
-- Renommer la table en arrière
ALTER TABLE sections RENAME TO section_templates;

-- Renommer l'index
ALTER INDEX IF EXISTS idx_sections_name RENAME TO idx_section_templates_name;

-- Renommer la fonction
ALTER FUNCTION update_sections_updated_at() RENAME TO update_section_templates_updated_at();

-- Recréer le trigger
DROP TRIGGER IF EXISTS trigger_update_sections_updated_at ON section_templates;
CREATE TRIGGER trigger_update_section_templates_updated_at
  BEFORE UPDATE ON section_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_section_templates_updated_at();
```

## ✨ Prêt pour la suite

Une fois cette migration effectuée, la structure sera plus claire pour le dernier gros élément du projet !
