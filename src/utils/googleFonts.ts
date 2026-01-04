// Liste des Google Fonts populaires pour l'éditeur d'emails
export const GOOGLE_FONTS = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Poppins',
  'Merriweather',
  'Nunito',
  'Playfair Display',
  'Ubuntu',
  'Mukta',
  'Rubik',
  'Work Sans',
  'Inter',
  'Libre Baskerville',
  'PT Sans',
  'Source Sans Pro',
  'Noto Sans',
  'Crimson Text',
  'Bebas Neue',
  'Quicksand',
  'Josefin Sans',
  'Bitter',
  'Cabin',
  'Arvo',
  'Karla',
  'Dosis',
  'Exo 2',
  'Titillium Web',
] as const;

// Liste des polices système courantes
const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Palatino',
];

/**
 * Vérifie si une font est une police système
 */
function isSystemFont(fontName: string): boolean {
  return SYSTEM_FONTS.some(f => f.toLowerCase() === fontName.toLowerCase());
}

/**
 * Charge une Google Font dynamiquement (sauf si c'est une police système)
 */
export function loadGoogleFont(fontName: string): void {
  // Ne pas charger si c'est une police système
  if (isSystemFont(fontName)) return;

  // Vérifier si la font est déjà chargée
  const existingLink = document.querySelector(`link[href*="${fontName.replace(/\s+/g, '+')}"]`);
  if (existingLink) return;

  // Créer un lien pour charger la font depuis Google Fonts
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Convertit un nom de font en CSS font-family
 * Supporte les Google Fonts et les polices système
 */
export function getFontFamily(fontName: string): string {
  if (isSystemFont(fontName)) {
    // Pour les polices système, ajouter des fallbacks
    return `'${fontName}', sans-serif`;
  }
  // Pour les Google Fonts
  return `'${fontName}', sans-serif`;
}
