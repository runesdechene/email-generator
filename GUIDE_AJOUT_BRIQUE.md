# Guide : Ajouter une Nouvelle Brique Réutilisable

Ce guide explique la procédure complète pour ajouter une nouvelle brique de configuration réutilisable dans l'application Email Generator.

## 📋 Vue d'ensemble

Une "brique" est un composant de configuration réutilisable qui peut être utilisé dans plusieurs types de sections (Texte, Hero, etc.). Exemples : PaddingControl, FontControl, BackgroundImageControl, etc.

## 🔧 Étapes d'implémentation

### 1. Créer le Composant de Contrôle

**Emplacement :** `src/components/ui/controls/`

**Fichier :** `NomDeLaBriqueControl.tsx`

```tsx
interface NomDeLaBriqueControlProps {
  // Props nécessaires (valeurs actuelles)
  option1?: string;
  option2?: number;
  // Fonction de mise à jour
  onUpdate: (path: string[], value: any) => void;
  // Props optionnelles (sectionId si besoin d'upload, currentTemplate si besoin des variables, etc.)
}

export function NomDeLaBriqueControl({
  option1 = "default",
  option2 = 0,
  onUpdate,
}: NomDeLaBriqueControlProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-xs font-semibold text-gray-700 mb-3">
        Titre de la Brique
      </h3>

      {/* Vos contrôles ici */}
      <input
        value={option1}
        onChange={(e) => onUpdate(["option1"], e.target.value)}
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
      />
    </div>
  );
}
```

**Conventions de style :**

- Couleur primaire : `#1E90FF` (bleu)
- Boutons actifs : `bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm`
- Boutons inactifs : `bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]`
- Inputs : `focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]`
- Labels : `text-xs font-medium text-gray-500`

### 2. Exporter le Composant

**Fichier :** `src/components/ui/controls/index.ts`

```tsx
export { NomDeLaBriqueControl } from "./NomDeLaBriqueControl";
```

### 3. Importer dans OptionsPanel

**Fichier :** `src/components/layout/OptionsPanel.tsx`

```tsx
import {
  PaddingControl,
  // ... autres imports
  NomDeLaBriqueControl, // Ajouter ici
} from "../ui/controls";
```

### 4. Intégrer dans les Sections

**Dans OptionsPanel.tsx**, ajouter le composant dans chaque section concernée :

```tsx
{
  sectionType?.name === "Texte" && (
    <>
      {/* ... autres briques */}

      <NomDeLaBriqueControl
        option1={(selectedSection.content.options as any)?.option1}
        option2={(selectedSection.content.options as any)?.option2}
        onUpdate={updateOption}
      />
    </>
  );
}

{
  sectionType?.name === "Hero" && (
    <>
      {/* ... autres briques */}

      <NomDeLaBriqueControl
        option1={(selectedSection.content.options as any)?.option1}
        option2={(selectedSection.content.options as any)?.option2}
        onUpdate={updateOption}
      />
    </>
  );
}
```

### 5. Modifier les Renderers

#### Pour ParagraphSection

**Fichier :** `src/sections/ParagraphSection/ParagraphSection.tsx`

1. **Ajouter les props dans l'interface :**

```tsx
interface ParagraphSectionProps {
  sectionId: string;
  data: {
    content: string;
  };
  options?: {
    // ... options existantes
    option1?: string;
    option2?: number;
  };
}
```

2. **Extraire les valeurs :**

```tsx
export function ParagraphSection({
  sectionId,
  data,
  options = {},
}: ParagraphSectionProps) {
  const option1 = options.option1 ?? "default";
  const option2 = options.option2 ?? 0;

  // ... reste du code
}
```

3. **Utiliser dans le rendu :**

```tsx
return (
  <>
    {/* Vos éléments basés sur les options */}
    <div
      className="section-texte"
      data-section-id={sectionId}
      style={baseStyle}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  </>
);
```

#### Pour HeroSection

**Fichier :** `src/components/sections/HeroSection.tsx`

Même principe que ParagraphSection :

1. Extraire les options
2. Utiliser dans le rendu avec `data-section-id={sectionId}`

### 6. Mettre à Jour Supabase (si nécessaire)

#### Si la brique nécessite des valeurs par défaut dans la DB

**Créer un script SQL :** `UPDATE_SECTION_OPTIONS.sql`

```sql
-- Mettre à jour les sections existantes avec les nouvelles options
UPDATE sections
SET default_content = jsonb_set(
  default_content,
  '{options}',
  default_content->'options' || '{"option1": "default", "option2": 0}'::jsonb
)
WHERE name IN ('Texte', 'Hero');

-- Vérification
SELECT name, default_content->'options'
FROM sections
WHERE name IN ('Texte', 'Hero');
```

**Exécuter dans l'éditeur SQL de Supabase.**

#### Si la brique nécessite un bucket de stockage

**Créer un script SQL :** `SETUP_BUCKET_NAME.sql`

```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('bucket-name', 'bucket-name', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques d'accès
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bucket-name');

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bucket-name');

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bucket-name');
```

**Exécuter dans l'éditeur SQL de Supabase.**

### 7. Ajouter au Service de Stockage (si upload requis)

**Fichier :** `src/services/supabase-storage.service.ts`

```tsx
export class SupabaseStorageService {
  private static readonly BUCKET_NAME = "bucket-name";

  static async uploadFile(file: File, id: string): Promise<string> {
    // Validation
    const validTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Type de fichier non supporté");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Fichier trop volumineux (max 5MB)");
    }

    // Upload
    const fileName = `${id}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file);

    if (error) throw error;

    // Récupérer l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(data.path);

    return publicUrl;
  }

  static async deleteFile(url: string): Promise<void> {
    const path = url.split(`${this.BUCKET_NAME}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path]);

    if (error) throw error;
  }
}
```

## 📝 Checklist Complète

- [ ] Créer le composant dans `src/components/ui/controls/`
- [ ] Exporter dans `src/components/ui/controls/index.ts`
- [ ] Importer dans `OptionsPanel.tsx`
- [ ] Intégrer dans toutes les sections concernées (Texte, Hero, etc.)
- [ ] Modifier `ParagraphSection.tsx` (interface + logique + rendu)
- [ ] Modifier `HeroSection.tsx` (interface + logique + rendu)
- [ ] Créer et exécuter les scripts SQL Supabase si nécessaire
- [ ] Ajouter les méthodes de service si upload requis
- [ ] Tester dans l'application
- [ ] Commit et push

## 🎯 Bonnes Pratiques

### Design

- Toujours utiliser la charte graphique (bleu `#1E90FF`)
- Rester cohérent avec les autres briques
- Utiliser les mêmes classes Tailwind

### Code

- **Une seule source de vérité** : Le composant est réutilisé, pas copié-collé
- **Props typées** : Utiliser TypeScript pour toutes les interfaces
- **Valeurs par défaut** : Toujours fournir des valeurs par défaut
- **Scoping** : Si CSS, utiliser `scopeCSS()` et `data-section-id`

### Supabase

- **Scripts versionnés** : Toujours créer des fichiers .sql
- **ON CONFLICT** : Utiliser pour éviter les doublons
- **Vérification** : Toujours inclure une requête SELECT de vérification

### Tests

- Tester dans section Texte
- Tester dans section Hero
- Tester l'export JPG
- Tester les presets (sauvegarde/chargement)

## 🔄 Exemple Complet : BackgroundImageControl

Voir l'implémentation de `BackgroundImageControl` comme référence complète :

- `src/components/ui/controls/BackgroundImageControl.tsx`
- Intégration dans `OptionsPanel.tsx`
- Utilisation dans `ParagraphSection.tsx` et `HeroSection.tsx`
- Service d'upload dans `supabase-storage.service.ts`
- Script SQL `SETUP_STORAGE_BUCKET.sql`

## 📚 Ressources

- **Types** : `src/types/supabase.ts` et `src/types/index.ts`
- **Store** : `src/store/emailStore.ts`
- **Hooks** : `src/hooks/useSupabase.ts`
- **Utils** : `src/utils/scopeCSS.ts`

---

**Note** : Ce guide est un document vivant. Mettez-le à jour si la procédure évolue !
