import { toJpeg } from 'html-to-image';

interface ExportOptions {
  element: HTMLElement;
  backgroundImageUrl?: string;
  backgroundSize?: 'cover' | 'repeat';
  fileName: string;
}

/**
 * Exporte une section avec son background image
 * Utilise un canvas pour composer le background et la section
 */
export async function exportSectionWithBackground({
  element,
  backgroundImageUrl,
  backgroundSize = 'cover',
  fileName,
}: ExportOptions): Promise<void> {
  const pixelRatio = 2;

  if (!backgroundImageUrl) {
    // Pas de background, export normal
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      pixelRatio,
    });
    downloadImage(dataUrl, fileName);
    return;
  }

  try {
    // 1. Calculer la position du background par rapport au conteneur
    const containerElement = element.closest('.email-preview-container');
    let offsetY = 0;
    
    if (containerElement) {
      // Calculer la position réelle en parcourant tous les éléments précédents
      let currentElement = element.previousElementSibling;
      let sectionIndex = 0;
      while (currentElement) {
        if (currentElement instanceof HTMLElement) {
          const height = currentElement.offsetHeight;
          console.log(`Section précédente ${sectionIndex}: hauteur = ${height}px`);
          offsetY += height;
          sectionIndex++;
        }
        currentElement = currentElement.previousElementSibling;
      }
      console.log(`Offset Y total calculé: ${offsetY}px pour ${sectionIndex} sections précédentes`);
      console.log(`Hauteur de la section actuelle: ${element.offsetHeight}px`);
    }

    // 2. Sauvegarder le style original de l'élément
    const originalStyle = element.style.cssText;
    
    // 3. Appliquer le background directement sur l'élément SANS animation
    console.log('Application du background sur la section...');
    element.style.transition = 'none';
    element.style.backgroundImage = `url(${backgroundImageUrl})`;
    element.style.backgroundRepeat = 'repeat-y';
    element.style.backgroundSize = backgroundSize === 'cover' ? 'cover' : '100% auto';
    element.style.backgroundPosition = `center -${offsetY}px`;
    
    // 4. Attendre que le background soit chargé
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 5. Exporter la section avec son background
    console.log('Export de la section avec background...');
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      pixelRatio,
      cacheBust: true,
    });
    
    // 6. Restaurer le style original
    element.style.cssText = originalStyle;
    
    // 7. Télécharger
    console.log('Téléchargement...');
    downloadImage(dataUrl, fileName);
    console.log('Export terminé avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'export avec background:', error);
    // Fallback : export sans background
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      pixelRatio,
    });
    downloadImage(dataUrl, fileName);
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
