# Refactorisation des Contrôles en Composants Réutilisables

## 🎯 Objectif

Créer des composants réutilisables pour les briques d'options afin d'éviter la duplication de code entre les différentes sections.

## ✅ Composants Créés

Tous les composants sont dans `src/components/ui/controls/` :

### 1. **PaddingControl.tsx** ✅

Gère les paddings avec :

- Toggles "Inline" et "Block" pour utiliser les paddings du template
- 4 inputs pour Haut, Bas, Gauche, Droite
- Désactivation automatique selon les toggles

### 2. **FontControl.tsx** ✅

Sélecteur de police :

- Police des titres
- Police des paragraphes

### 3. **FontSizeControl.tsx** ✅

Gère la taille de police avec :

- Toggle "Variable du template" / "Taille personnalisée"
- Grid de 6 boutons (XXL, XL, L, M, S, XS) en mode template
- Slider + input numérique (8-72px) en mode personnalisé

### 4. **ColorControl.tsx** ✅

Gère la couleur avec :

- Toggle "Variable du template" / "Couleur personnalisée"
- Grid des 5 couleurs principales en mode template
- Grid des couleurs personnalisées du template
- Color picker + input hex en mode personnalisé

### 5. **TextStyleControl.tsx** ✅

Gère le style du texte avec :

- Alignement (Left, Center, Right, Justify)
- Décoration (Bold, Italic, Underline)
- Hauteur de ligne
- Espacement des lettres

### 6. **CustomCSSControl.tsx** ✅

Textarea pour CSS personnalisé

### 7. **index.ts** ✅

Export centralisé de tous les composants

## 📋 Utilisation

```tsx
import {
  PaddingControl,
  FontControl,
  FontSizeControl,
  ColorControl,
  TextStyleControl,
  CustomCSSControl
} from '../ui/controls';

// Dans le render
<PaddingControl
  paddingTop={options.paddingTop}
  paddingBottom={options.paddingBottom}
  paddingLeft={options.paddingLeft}
  paddingRight={options.paddingRight}
  useTemplatePaddingInline={options.useTemplatePaddingInline}
  useTemplatePaddingBlock={options.useTemplatePaddingBlock}
  onUpdate={updateOption}
/>

<FontControl
  font={options.font}
  onUpdate={updateOption}
/>

<FontSizeControl
  fontSize={options.fontSize}
  currentTemplate={currentTemplate}
  onUpdate={updateOption}
/>

<ColorControl
  color={options.color}
  currentTemplate={currentTemplate}
  onUpdate={updateOption}
/>

<TextStyleControl
  align={options.textStyle?.align}
  bold={options.textStyle?.bold}
  italic={options.textStyle?.italic}
  underline={options.textStyle?.underline}
  lineHeight={options.textStyle?.lineHeight}
  letterSpacing={options.textStyle?.letterSpacing}
  onUpdate={updateOption}
/>

<CustomCSSControl
  customCSS={options.customCSS}
  onUpdate={updateOption}
/>
```

## 🔄 Prochaines Étapes

### À faire

- [ ] Remplacer le code dupliqué dans la section Texte par les composants
- [ ] Remplacer le code dupliqué dans la section Hero par les composants
- [ ] Tester que tout fonctionne correctement
- [ ] Vérifier que les modifications dans un composant affectent toutes les sections

## ✨ Avantages

1. **DRY (Don't Repeat Yourself)** - Une seule source de vérité
2. **Maintenabilité** - Modifier un composant met à jour toutes les sections
3. **Cohérence** - Design identique garanti entre toutes les sections
4. **Réutilisabilité** - Facile d'ajouter de nouvelles sections
5. **Testabilité** - Chaque composant peut être testé indépendamment

## 📝 Notes

- Tous les composants utilisent la même charte graphique (bleu primaire #1E90FF)
- Les props sont typées avec TypeScript
- La fonction `onUpdate` prend un path (array de strings) et une valeur
- Les valeurs par défaut sont définies dans les props

## 🎨 Design Cohérent

Tous les composants suivent les mêmes conventions :

- Boutons actifs : `bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm`
- Boutons inactifs : `bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]`
- Inputs : `focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]`
- Labels : `text-xs font-medium text-gray-500`
