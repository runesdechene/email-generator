# Migration des couleurs - Violet → Nouvelle Charte

## Remplacements à effectuer

### Couleurs principales

- `violet-600` → `[#1E90FF]` (bleu primaire)
- `violet-500` → `[#00BFFF]` (cyan hover)
- `violet-700` → `[#0066CC]` (bleu foncé)
- `violet-50` → `blue-50`
- `violet-100` → `blue-100`

### Couleurs secondaires

- Garder `emerald-` pour les success
- Garder `red-` pour les errors
- Remplacer certains `gray-` par des tons plus chauds si nécessaire

### Backgrounds

- `bg-gray-50` → `bg-[#F5F7FA]` (bg-light de la charte)
- `bg-gray-100` → `bg-[#F5F7FA]`

## Fichiers à modifier (par priorité)

1. **Navbar.tsx** - Navigation principale
2. **Sidebar.tsx** - Barre latérale
3. **OptionsPanel.tsx** - Panneau d'options
4. **ProjectManager.tsx** - Gestion projets
5. **TemplateEditor.tsx** - Éditeur de templates
6. **TemplateList.tsx** - Liste templates
7. **AuthPage.tsx** - Page de connexion
8. **App.tsx** - Composant principal
9. **EditorNavbar.tsx** - Navbar éditeur
10. **EmailPreview.tsx** - Prévisualisation
11. **TemplateSelectorPanel.tsx** - Sélecteur
12. **AuthGuard.tsx** - Guard auth
