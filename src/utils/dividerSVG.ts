/**
 * Génère le code SVG pour les dividers
 */

export function generateDividerSVG(
  type: 'wave' | 'slant',
  color: string,
  flip: boolean = false
): string {
  const transform = flip ? 'scale(1, -1)' : 'scale(1, 1)';
  
  if (type === 'wave') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block; transform: ${transform};"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="${color}"></path></svg>`;
  }
  
  if (type === 'slant') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block; transform: ${transform};"><path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="${color}"></path></svg>`;
  }
  
  return '';
}
