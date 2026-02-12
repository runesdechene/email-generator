import { toJpeg } from 'html-to-image';

interface ExportMultipleSectionsOptions {
  sectionIds: string[];
  sectionsRef: Map<string, HTMLDivElement>;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundColor?: string;
  fileName: string;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Ne pas mettre crossOrigin pour les data URLs
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossible de charger l'image: ${url.substring(0, 100)}`));
    img.src = url;
  });
}

/**
 * Exporte plusieurs sections en une seule image JPG
 * Utilise la même approche que l'export individuel
 */
export async function exportMultipleSections({
  sectionIds,
  sectionsRef,
  backgroundImageUrl,
  backgroundSize = 'cover',
  backgroundColor,
  fileName,
}: ExportMultipleSectionsOptions): Promise<void> {
  const pixelRatio = 2;

  try {
    // 1. Récupérer tous les éléments des sections à exporter
    // Si des refs manquent, tenter de les retrouver via data-section-id
    const elements: HTMLDivElement[] = [];
    for (const id of sectionIds) {
      let el = sectionsRef.get(id);
      if (!el || !el.isConnected) {
        // Fallback: chercher dans le DOM par data-section-id
        const found = document.querySelector(`[data-section-id="${id}"]`) as HTMLDivElement | null;
        if (found) {
          el = found;
          sectionsRef.set(id, found); // Mettre à jour la ref
          console.log(`Section ${id} retrouvée via DOM query`);
        }
      }
      if (el) {
        elements.push(el);
      } else {
        console.warn(`Section ${id} introuvable dans le DOM`);
      }
    }

    if (elements.length === 0) {
      throw new Error('Aucune section à exporter');
    }

    console.log(`Export de ${elements.length}/${sectionIds.length} section(s)`);

    // 2. Calculer dimensions
    const width = elements[0].offsetWidth;
    let totalHeight = 0;
    const heights: number[] = [];
    
    elements.forEach(el => {
      const height = el.offsetHeight;
      heights.push(height);
      totalHeight += height;
    });

    console.log(`Dimensions totales: ${width}x${totalHeight}px`);

    // 3. Créer un canvas
    const canvas = document.createElement('canvas');
    canvas.width = width * pixelRatio;
    canvas.height = totalHeight * pixelRatio;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    ctx.scale(pixelRatio, pixelRatio);

    // 4a. Remplir le fond (blanc par défaut pour JPEG, puis couleur choisie)
    ctx.fillStyle = backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, totalHeight);

    // 4b. Dessiner le background image si présent
    if (backgroundImageUrl) {
      try {
        const bgImg = await loadImage(backgroundImageUrl);
        if (backgroundSize === 'cover') {
          ctx.drawImage(bgImg, 0, 0, width, totalHeight);
        } else {
          const pattern = ctx.createPattern(bgImg, 'repeat');
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, width, totalHeight);
          }
        }
      } catch (error) {
        console.warn('Erreur chargement background:', error);
      }
    }

    // 5. Exporter chaque section
    let currentY = 0;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const height = heights[i];
      
      console.log(`Export section ${i + 1}/${elements.length} à y=${currentY}`);
      
      // Sauvegarder le style original
      const originalStyle = element.style.cssText;
      
      try {
        // Appliquer le background directement sur l'élément
        if (backgroundImageUrl) {
          element.style.transition = 'none';
          element.style.backgroundImage = `url(${backgroundImageUrl})`;
          element.style.backgroundRepeat = 'repeat-y';
          element.style.backgroundSize = backgroundSize === 'cover' ? 'cover' : '100% auto';
          element.style.backgroundPosition = `center -${currentY}px`;
        }
        
        // Attendre que le background soit chargé
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Exporter la section en image
        const sectionDataUrl = await toJpeg(element, {
          quality: 0.95,
          pixelRatio,
          backgroundColor: backgroundColor || '#ffffff',
          cacheBust: true,
          includeQueryParams: true,
          filter: (node: Element) => {
            if (node instanceof HTMLElement) {
              return !node.hasAttribute('data-export-ignore');
            }
            return true;
          },
        });
        
        // Restaurer le style original
        element.style.cssText = originalStyle;
        
        // Charger l'image de la section et dessiner sur le canvas
        const sectionImg = await loadImage(sectionDataUrl);
        ctx.drawImage(sectionImg, 0, currentY, width, height);
      } catch (sectionError) {
        console.warn(`Erreur export section ${i + 1}, tentative sans cacheBust...`, sectionError);
        // Restaurer le style original dans tous les cas
        element.style.cssText = originalStyle;
        
        // Retry sans cacheBust (évite les problèmes d'images cassées)
        try {
          const fallbackDataUrl = await toJpeg(element, {
            quality: 0.95,
            pixelRatio,
            backgroundColor: backgroundColor || '#ffffff',
            filter: (node: Element) => {
              if (node instanceof HTMLElement) {
                return !node.hasAttribute('data-export-ignore');
              }
              return true;
            },
          });
          const fallbackImg = await loadImage(fallbackDataUrl);
          ctx.drawImage(fallbackImg, 0, currentY, width, height);
        } catch (fallbackError) {
          console.warn(`Section ${i + 1} ignorée dans l'export (images inaccessibles)`, fallbackError);
          // Dessiner un rectangle blanc en fallback
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, currentY, width, height);
        }
      }
      
      currentY += height;
    }

    // 6. Convertir le canvas en JPG
    const finalDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // 7. Télécharger
    downloadImage(finalDataUrl, fileName);
    
    console.log('Export multi-sections terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'export multi-sections:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Télécharge une image depuis une data URL
 */
function downloadImage(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
