# 🎨 Application de la Nouvelle Charte Graphique

## ✅ Changements appliqués

### Couleurs principales

- **Bleu primaire** : `#1E90FF` (remplace violet-600)
- **Bleu foncé** : `#0066CC` (remplace violet-700)
- **Cyan hover** : `#00BFFF` (remplace violet-500)
- **Orange** : `#FFA500` (accents)
- **Backgrounds** : `#F5F7FA` (remplace gray-50/100)

### Composants modifiés

#### ✅ Navbar.tsx

- Boutons actifs : `bg-[#1E90FF]` avec `shadow-md`
- Hover : `hover:bg-blue-50 hover:text-[#1E90FF]`
- Style plus moderne et cohérent avec le logo

#### ✅ AuthPage.tsx

- Background : Dégradé `from-blue-50 via-white to-cyan-50`
- Bouton principal : `bg-[#1E90FF]` avec `hover:bg-[#0066CC]`
- Focus inputs : `focus:ring-[#1E90FF]`
- Liens : `text-[#1E90FF] hover:text-[#0066CC]`
- Ajout de shadows pour plus de profondeur

#### ✅ index.css

- Variables CSS ajoutées pour la charte
- Couleurs accessibles globalement

### Composants à modifier

#### 🔄 App.tsx

- Boutons d'export multi-sections
- Bouton "Visualiser"
- Cadres de sélection

#### 🔄 ProjectManager.tsx

- Boutons "Sauvegarder" et "Charger"
- États actifs/hover

#### 🔄 OptionsPanel.tsx

- Bouton d'export
- Inputs et selects
- Sections actives

#### 🔄 TemplateEditor.tsx

- Bouton "Sauvegarder"
- Inputs de configuration
- Sélecteurs de couleurs

#### 🔄 TemplateList.tsx

- Bouton "Nouveau template"
- Cartes de templates

#### 🔄 Sidebar.tsx

- Boutons d'ajout de sections
- Sections actives

#### 🔄 EmailPreview.tsx

- Cadres de sélection (ring)

#### 🔄 Toast.tsx

- Couleurs des toasts info

## Principe de remplacement

### Boutons primaires

```tsx
// Avant
className = "bg-violet-600 hover:bg-violet-500";

// Après
className = "bg-[#1E90FF] hover:bg-[#0066CC] shadow-md hover:shadow-lg";
```

### Boutons secondaires

```tsx
// Avant
className = "bg-gray-200 hover:bg-gray-300";

// Après
className = "bg-blue-50 hover:bg-blue-100 text-[#1E90FF]";
```

### Hover states

```tsx
// Avant
className = "hover:bg-gray-100";

// Après
className = "hover:bg-blue-50 hover:text-[#1E90FF]";
```

### Focus states

```tsx
// Avant
className = "focus:ring-violet-500";

// Après
className = "focus:ring-[#1E90FF]";
```

### Backgrounds

```tsx
// Avant
className = "bg-gray-50";

// Après
className = "bg-[#F5F7FA]";
```

## Style général

- **Shadows** : Ajouter `shadow-md` aux éléments importants
- **Hover** : Ajouter `hover:shadow-lg` pour l'interactivité
- **Transitions** : Garder `transition-all` partout
- **Rounded** : Garder les coins arrondis (8px, 12px)
- **Colors** : Préférer les couleurs hexadécimales pour la cohérence

## Prochaines étapes

1. Modifier App.tsx (boutons d'export)
2. Modifier ProjectManager.tsx (boutons de gestion)
3. Modifier OptionsPanel.tsx (panneau d'options)
4. Modifier TemplateEditor.tsx (éditeur)
5. Modifier TemplateList.tsx (liste)
6. Modifier Sidebar.tsx (barre latérale)
7. Modifier EmailPreview.tsx (cadres)
8. Modifier Toast.tsx (notifications)
9. Tester l'ensemble de l'interface
10. Ajuster si nécessaire
