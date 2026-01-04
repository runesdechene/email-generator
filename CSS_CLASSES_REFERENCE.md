# Référence des Classes CSS pour le CSS Personnalisé

Ce document liste toutes les classes CSS disponibles pour cibler des éléments spécifiques dans vos sections avec le CSS personnalisé.

## 🎯 Classes Communes à Toutes les Sections

### Container Principal

- **`.section-container`** : Le conteneur principal de la section
- **`.section-texte`** : Conteneur spécifique à la section Texte
- **`.section-hero`** : Conteneur spécifique à la section Hero

### Contenu

- **`.section-content`** : Le contenu HTML de la section (texte, HTML personnalisé)
- **`.section-content-wrapper`** : Wrapper du contenu (Hero avec image uniquement)

### Dividers (Transitions Visuelles)

- **`.section-divider`** : Tous les dividers (haut et bas)
- **`.section-divider-top`** : Divider du haut uniquement
- **`.section-divider-bottom`** : Divider du bas uniquement
- **`.section-divider-svg`** : Divider SVG (vague ou ligne penchée)
- **`.section-divider-image`** : Divider image personnalisée

## 🦸 Classes Spécifiques à la Section Hero

- **`.section-hero-image`** : L'image principale du Hero

## 📝 Exemples d'Utilisation

### Exemple 1 : Modifier le contenu

```css
.section-content {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}
```

### Exemple 2 : Styliser les dividers

```css
/* Tous les dividers */
.section-divider {
  opacity: 0.8;
}

/* Divider du haut uniquement */
.section-divider-top {
  transform: translateY(-10px);
}

/* Divider SVG uniquement */
.section-divider-svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
```

### Exemple 3 : Modifier l'image Hero

```css
.section-hero-image {
  filter: brightness(1.1) contrast(1.05);
  border-radius: 16px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

### Exemple 4 : Cibler des éléments HTML dans le contenu

```css
/* Cibler les images dans le contenu */
.section-content img {
  filter: invert();
  border-radius: 8px;
}

/* Cibler les paragraphes */
.section-content p {
  line-height: 1.8;
  margin-bottom: 1em;
}

/* Cibler les titres */
.section-content h1,
.section-content h2 {
  font-weight: bold;
  margin-bottom: 0.5em;
}
```

### Exemple 5 : Effets au survol

```css
.section-hero-image {
  transition: transform 0.3s ease;
}

.section-hero-image:hover {
  transform: scale(1.05);
}
```

### Exemple 6 : Combiner plusieurs classes

```css
/* Divider du bas avec SVG */
.section-divider-bottom.section-divider svg {
  opacity: 0.5;
}

/* Container Hero avec fond */
.section-hero.section-container {
  border-radius: 12px;
  overflow: hidden;
}
```

## 🔍 Ciblage Spécifique à une Section

Chaque section a un attribut `data-section-id` unique. Le CSS est automatiquement scopé à la section, mais vous pouvez aussi utiliser cet attribut :

```css
/* Cible automatiquement la section actuelle */
.section-content img {
  filter: grayscale(100%);
}

/* Équivalent avec data-section-id (géré automatiquement) */
[data-section-id="abc123"] .section-content img {
  filter: grayscale(100%);
}
```

## 💡 Bonnes Pratiques

1. **Utilisez les classes, pas les IDs** : Les classes sont réutilisables et plus flexibles
2. **Soyez spécifique** : Utilisez `.section-content img` plutôt que juste `img`
3. **Testez progressivement** : Ajoutez une règle à la fois pour voir l'effet
4. **Utilisez `!important` avec parcimonie** : Seulement si nécessaire pour surcharger les styles inline
5. **Pensez responsive** : Les emails doivent être lisibles sur mobile

## 🚀 Classes Avancées

### Pseudo-classes supportées

```css
.section-content a:hover {
  color: #1e90ff;
}

.section-content p:first-child {
  font-size: 1.2em;
}

.section-content img:last-of-type {
  margin-bottom: 0;
}
```

### Animations CSS

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.section-content {
  animation: fadeIn 0.5s ease-in;
}
```

## 📚 Hiérarchie des Classes

```
.section-container (section-texte ou section-hero)
├── .section-divider.section-divider-top
│   ├── .section-divider-svg (ou)
│   └── .section-divider-image
├── .section-content (ou .section-content-wrapper pour Hero avec image)
│   ├── .section-hero-image (Hero uniquement)
│   └── Votre HTML personnalisé
└── .section-divider.section-divider-bottom
    ├── .section-divider-svg (ou)
    └── .section-divider-image
```

## ⚠️ Limitations

- Le CSS est scopé à la section : il n'affecte pas les autres sections ni le reste du site
- Les styles inline ont priorité sur le CSS personnalisé (utilisez `!important` si nécessaire)
- Certaines propriétés CSS peuvent ne pas fonctionner dans tous les clients email

---

**Astuce** : Utilisez les DevTools de votre navigateur (F12) pour inspecter les éléments et tester votre CSS en temps réel !
