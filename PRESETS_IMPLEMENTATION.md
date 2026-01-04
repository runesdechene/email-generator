# Système de Presets de Sections - Implémentation

## 🎯 Objectif

Permettre aux utilisateurs de sauvegarder et réutiliser des configurations de sections personnalisées entre différents projets d'email.

## 📊 Architecture

### Base de données

**Table `section_presets`**

- `id` (UUID) - Clé primaire
- `user_id` (UUID) - Référence à l'utilisateur (RLS)
- `name` (TEXT) - Nom du preset
- `description` (TEXT) - Description optionnelle
- `section_type` (TEXT) - Type de section ('Texte', etc.)
- `content` (JSONB) - Tous les réglages de la section
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Table `preset_templates` (Many-to-Many)**

- `preset_id` (UUID) - Référence au preset
- `template_id` (UUID) - Référence au template
- Clé primaire composite (preset_id, template_id)

### Politiques RLS

- Les utilisateurs ne peuvent voir/modifier que leurs propres presets
- Les liaisons preset-template sont protégées par RLS

## ✅ Progression

### 1. Base de données ✅

- [x] Script SQL `SETUP_SECTION_PRESETS.sql` créé
- [x] Tables avec RLS configurées
- [x] Index pour les performances
- [x] Triggers pour updated_at

### 2. Types TypeScript ✅

- [x] Interface `SectionPreset` dans `types/supabase.ts`
- [x] Interface `SectionPresetData` dans `services/supabase.service.ts`

### 3. Service Supabase ✅

- [x] `getSectionPresets()` - Récupérer tous les presets
- [x] `getPresetsByTemplate()` - Filtrer par template
- [x] `createSectionPreset()` - Créer avec liaisons
- [x] `updateSectionPreset()` - Mettre à jour avec liaisons
- [x] `deleteSectionPreset()` - Supprimer
- [x] `getPresetTemplateIds()` - Récupérer les templates liés

### 4. Hook React ✅

- [x] `usePresets()` créé dans `hooks/usePresets.ts`
- [x] Conversion Supabase ↔ App
- [x] Gestion du loading et des erreurs
- [x] CRUD complet

### 5. Interface Utilisateur 🚧

- [x] Modification du header d'OptionsPanel
  - Type de section affiché avec icône LayoutGrid
  - Badge bleu à côté du titre
- [x] Section "Preset de section" ajoutée
  - Bouton "Sauvegarder" (icône Save)
  - Bouton "Charger un preset..."
- [ ] Dialog "Sauvegarder comme preset"
  - Nom du preset
  - Description (optionnel)
  - Sélection des templates (minimum 1)
- [ ] Dialog "Charger un preset"
  - Liste des presets filtrés par template actuel
  - Aperçu des réglages
  - Bouton "Appliquer"

## 🎨 Design UI

### Header OptionsPanel

```
┌─────────────────────────────────────────┐
│ Options de la section  [📊 Texte]  [X] │
└─────────────────────────────────────────┘
```

### Section Preset

```
┌─────────────────────────────────────────┐
│ Preset de section        [💾 Sauvegarder]│
│ ┌─────────────────────────────────────┐ │
│ │ Charger un preset...                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🔄 Flux utilisateur

### Sauvegarder un preset

1. Configurer une section avec tous les réglages souhaités
2. Cliquer sur "Sauvegarder" à côté de "Preset de section"
3. Entrer un nom et description
4. Sélectionner les templates auxquels lier ce preset (minimum 1)
5. Confirmer → Preset créé et disponible

### Charger un preset

1. Cliquer sur "Charger un preset..."
2. Voir la liste des presets disponibles pour le template actuel
3. Sélectionner un preset
4. Cliquer "Appliquer" → Tous les réglages sont appliqués à la section

## 📝 Prochaines étapes

1. **Créer le composant SavePresetDialog**

   - Form avec nom, description
   - Sélecteur multiple de templates (checkboxes)
   - Validation (nom requis, au moins 1 template)

2. **Créer le composant LoadPresetDialog**

   - Liste des presets filtrés par template actuel
   - Carte pour chaque preset avec nom, description, date
   - Bouton "Appliquer" pour chaque preset

3. **Intégrer les dialogs dans OptionsPanel**

   - Gérer l'ouverture/fermeture
   - Passer les données nécessaires
   - Appliquer les presets à la section

4. **Tester le système complet**
   - Créer un preset
   - Charger un preset dans une autre section
   - Vérifier la liaison avec les templates
   - Tester la suppression

## 🎯 Avantages

- ✅ Réutilisation rapide de configurations complexes
- ✅ Cohérence entre projets
- ✅ Gain de temps significatif
- ✅ Isolation par utilisateur (RLS)
- ✅ Flexibilité (liaison multiple templates)
