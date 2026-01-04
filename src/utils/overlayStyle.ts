/**
 * Génère le style CSS pour l'overlay d'une image de fond
 */

import React from 'react';

interface OverlayOptions {
  enabled?: boolean;
  type?: 'color' | 'gradient';
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: 'to-bottom' | 'to-top' | 'to-right' | 'to-left' | 'to-bottom-right' | 'to-bottom-left';
  opacity?: number;
  blur?: number;
}

export function generateOverlayStyle(overlay?: OverlayOptions): React.CSSProperties | null {
  if (!overlay || !overlay.enabled) {
    return null;
  }

  const opacity = (overlay.opacity ?? 50) / 100;

  if (overlay.type === 'gradient') {
    const start = overlay.gradientStart || '#000000';
    const end = overlay.gradientEnd || '#ffffff';
    const direction = overlay.gradientDirection || 'to-bottom';

    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `linear-gradient(${direction}, ${start}, ${end})`,
      opacity,
      pointerEvents: 'none' as const,
      zIndex: 2,
    } as React.CSSProperties;
  }

  // Type color
  const color = overlay.color || '#000000';

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: color,
    opacity,
    pointerEvents: 'none' as const,
    zIndex: 2,
  } as React.CSSProperties;
}

/**
 * Génère le filtre CSS pour le blur de l'image de fond
 */
export function generateBackgroundBlur(blur?: number): string {
  if (!blur || blur === 0) {
    return '';
  }
  return `blur(${blur}px)`;
}
