import { toJpeg } from 'html-to-image';

interface ExportMultipleSectionsOptions {
  sectionIds: string[];
  sectionsRef: Map<string, HTMLDivElement>;
  backgroundImageUrl?: string;
  backgroundSize?: 'cover' | 'repeat';
  fileName: string;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
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
  fileName,
}: ExportMultipleSectionsOptions): Promise<void> {
  const pixelRatio = 2;

  try {
    // 1. Récupérer tous les éléments des sections à exporter
    const elements = sectionIds
      .map(id => sectionsRef.get(id))
      .filter((el): el is HTMLDivElement => el !== undefined);

    if (elements.length === 0) {
      throw new Error('Aucune section à exporter');
    }

    console.log(`Export de ${elements.length} section(s)`);

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

    // 4. Dessiner le background si présent
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

    // 5. Exporter chaque section AVEC LA MÊME MÉTHODE que l'export individuel
    let currentY = 0;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const height = heights[i];
      
      console.log(`Export section ${i + 1}/${elements.length} à y=${currentY}`);
      
      // Sauvegarder le style original
      const originalStyle = element.style.cssText;
      
      // Appliquer le background directement sur l'élément (comme dans exportSectionWithBackground)
      if (backgroundImageUrl) {
        element.style.transition = 'none';
        element.style.backgroundImage = `url(${backgroundImageUrl})`;
        element.style.backgroundRepeat = 'repeat-y';
        element.style.backgroundSize = backgroundSize === 'cover' ? 'cover' : '100% auto';
        element.style.backgroundPosition = `center -${currentY}px`;
      }
      
      // Attendre que le background soit chargé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Exporter la section EXACTEMENT comme dans exportSectionWithBackground
      const sectionDataUrl = await toJpeg(element, {
        quality: 0.95,
        pixelRatio,
        cacheBust: true,
      });
      
      // Restaurer le style original
      element.style.cssText = originalStyle;
      
      // Charger l'image de la section
      const sectionImg = await loadImage(sectionDataUrl);
      
      // Dessiner la section sur le canvas
      ctx.drawImage(sectionImg, 0, currentY, width, height);
      
      currentY += height;
    }

    // 6. Convertir le canvas en JPG
    const finalDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // 7. Télécharger
    downloadImage(finalDataUrl, fileName);
    
    console.log('Export multi-sections terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'export multi-sections:', error);
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
