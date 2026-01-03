import { toJpeg } from 'html-to-image';

interface ExportOptions {
  element: HTMLElement;
  backgroundImageUrl?: string;
  fileName: string;
}

/**
 * Charge une image depuis une URL
 */
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
 * Exporte une section avec son background image
 * Utilise un canvas pour composer le background et la section
 */
export async function exportSectionWithBackground({
  element,
  backgroundImageUrl,
  fileName,
}: ExportOptions): Promise<void> {
  const pixelRatio = 2;
  const width = element.offsetWidth;
  const height = element.offsetHeight;

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
    // 1. Calculer la position du background
    const containerElement = element.closest('.email-preview-container');
    let offsetY = 0;
    
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      offsetY = elementRect.top - containerRect.top;
      console.log('Offset Y calculé:', offsetY);
    }

    // 2. Sauvegarder le style original de l'élément
    const originalStyle = element.style.cssText;
    
    // 3. Appliquer le background directement sur l'élément
    console.log('Application du background sur la section...');
    element.style.backgroundImage = `url(${backgroundImageUrl})`;
    element.style.backgroundRepeat = 'repeat-y';
    element.style.backgroundSize = 'cover';
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
    alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
