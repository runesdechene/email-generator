# Section Hero - Implémentation Complète

## 🎯 Objectif

Créer une nouvelle section "Hero" pour les en-têtes d'email avec image et texte, incluant un nouveau composant **Image_Picker** pour uploader des images depuis le PC.

## ✅ Implémentation Complète

### 1. **Service d'Upload d'Images** ✅

**Fichier modifié :** `src/services/supabase-storage.service.ts`

- Ajout du bucket `section-images`
- Méthode `uploadSectionImage(file, sectionId)` - Upload d'images
- Méthode `deleteSectionImage(imageUrl)` - Suppression d'images
- Gestion des erreurs et validation (type, taille max 5MB)

### 2. **Composant ImagePicker** ✅

**Fichier créé :** `src/components/ui/ImagePicker.tsx`

Fonctionnalités :

- Upload d'images par clic (PNG, JPG, GIF jusqu'à 5MB)
- Prévisualisation de l'image uploadée
- Bouton de suppression au hover
- Validation du type et de la taille
- États de chargement avec spinner
- Messages d'erreur
- Design cohérent avec la charte graphique (bleu primaire)

### 3. **Base de Données** ✅

**Script SQL :** `ADD_HERO_SECTION.sql`

Section Hero ajoutée dans la table `sections` avec :

```json
{
  "content": "<h1>Titre principal</h1><p>Votre texte ici...</p>",
  "options": {
    "imageUrl": "",
    "paddingTop": 32,
    "paddingBottom": 32,
    "paddingLeft": 32,
    "paddingRight": 32,
    "useTemplatePaddingInline": true,
    "useTemplatePaddingBlock": true,
    "font": "title",
    "fontSize": "xl",
    "color": "primary",
    "textStyle": {
      "align": "center",
      "bold": false,
      "italic": false,
      "underline": false,
      "lineHeight": 1.5
    },
    "customCSS": ""
  }
}
```

### 4. **Renderer de la Section Hero** ✅

**Fichier créé :** `src/components/sections/HeroSection.tsx`

Fonctionnalités :

- Rendu avec ou sans image
- Layout flex avec image en haut et contenu en bas
- Support de tous les réglages (padding, police, taille, couleur, style)
- Gestion des variables du template
- Parsing du CSS personnalisé
- Rendu HTML du contenu

**Fichier modifié :** `src/components/editor/SectionRenderer.tsx`

- Ajout du cas `sectionType?.name === 'Hero'`
- Intégration du `HeroSection`

### 5. **Options de Configuration** ✅

**Fichier modifié :** `src/components/layout/OptionsPanel.tsx`

Options disponibles pour la section Hero :

1. **Image Picker** - Upload et gestion d'image
2. **Contenu** - Textarea HTML
3. **Padding** - 4 directions + toggles template
4. **Police** - Titre ou Paragraphe
5. **Taille de Police** - Variable template ou personnalisée
6. **Couleur** - Variable template ou personnalisée
7. **Style du Texte** - Alignement (left, center, right, justify)
8. **CSS Personnalisé** - Textarea pour CSS custom

### 6. **Supabase Storage** ✅

**Script SQL :** `SETUP_STORAGE_BUCKET.sql`

- Création du bucket `section-images` (public)
- Politique d'upload pour utilisateurs authentifiés
- Politique de lecture publique
- Politique de suppression par le propriétaire

## 📋 Scripts SQL à Exécuter

### 1. Créer le bucket de stockage

```bash
# Dans Supabase SQL Editor
SETUP_STORAGE_BUCKET.sql
```

### 2. Ajouter la section Hero

```bash
# Dans Supabase SQL Editor
ADD_HERO_SECTION.sql
```

## 🎨 Caractéristiques de la Section Hero

### Layout

- **Avec image** : Image en haut (100% width, auto height, border-radius 8px) + Contenu en bas
- **Sans image** : Contenu uniquement

### Réglages Disponibles

- ✅ Image (upload depuis PC)
- ✅ Contenu HTML
- ✅ Padding (4 directions + template)
- ✅ Police (titre/paragraphe)
- ✅ Taille de police (variable/personnalisée)
- ✅ Couleur (variable/personnalisée)
- ✅ Alignement du texte
- ✅ CSS personnalisé

### Valeurs par Défaut

- Alignement : `center`
- Police : `title`
- Taille : `xl` (36px)
- Couleur : `primary`
- Padding : 32px (tous côtés)

## 🎯 Utilisation

1. **Créer une section Hero**

   - Cliquer sur "+" dans la sidebar
   - Sélectionner "Hero"

2. **Ajouter une image**

   - Cliquer sur "Cliquez pour choisir une image"
   - Sélectionner une image (PNG, JPG, GIF max 5MB)
   - L'image est uploadée automatiquement

3. **Configurer le contenu**

   - Modifier le HTML dans la textarea
   - Ajuster les réglages (padding, police, couleur, etc.)

4. **Sauvegarder comme preset** (optionnel)
   - Cliquer sur "Sauvegarder" à côté de "Preset de section"
   - Donner un nom et sélectionner les templates
   - Réutiliser dans d'autres projets

## 🚀 Prêt à Tester

La section Hero est entièrement implémentée et prête à être utilisée !

**Prochaines étapes :**

1. Exécuter les scripts SQL dans Supabase
2. Tester la création d'une section Hero
3. Uploader une image
4. Configurer les réglages
5. Exporter en JPG

## 📦 Fichiers Créés/Modifiés

**Créés :**

- `src/components/ui/ImagePicker.tsx`
- `src/components/sections/HeroSection.tsx`
- `ADD_HERO_SECTION.sql`
- `SETUP_STORAGE_BUCKET.sql`
- `HERO_SECTION_IMPLEMENTATION.md`

**Modifiés :**

- `src/services/supabase-storage.service.ts`
- `src/components/editor/SectionRenderer.tsx`
- `src/components/layout/OptionsPanel.tsx`
