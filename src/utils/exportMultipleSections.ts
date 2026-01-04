import { toJpeg } from 'html-to-image';

interface ExportMultipleSectionsOptions {
  sectionIds: string[];
  sectionsRef: Map<string, HTMLDivElement>;
  backgroundImageUrl?: string;
  backgroundSize?: 'cover' | 'repeat';
  fileName: string;
}

/**
 * Exporte plusieurs sections en une seule image JPG
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

    // 2. Créer un conteneur temporaire pour combiner les sections
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${elements[0].offsetWidth}px`;
    
    // Appliquer le background si présent
    if (backgroundImageUrl) {
      container.style.backgroundImage = `url(${backgroundImageUrl})`;
      container.style.backgroundRepeat = 'repeat-y';
      container.style.backgroundSize = backgroundSize === 'cover' ? 'cover' : '100% auto';
      container.style.backgroundPosition = 'center top';
    }
    
    document.body.appendChild(container);

    // 3. Cloner et ajouter chaque section au conteneur
    for (const element of elements) {
      const clone = element.cloneNode(true) as HTMLDivElement;
      // Retirer les bordures de sélection du clone
      clone.style.outline = 'none';
      clone.style.border = 'none';
      clone.classList.remove('ring-2', 'ring-4', 'ring-violet-500', 'ring-emerald-500', 'ring-inset');
      container.appendChild(clone);
    }

    // 4. Attendre que le DOM se mette à jour
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5. Exporter le conteneur combiné
    const dataUrl = await toJpeg(container, {
      quality: 0.95,
      pixelRatio,
      cacheBust: true,
    });

    // 6. Nettoyer
    document.body.removeChild(container);

    // 7. Télécharger
    downloadImage(dataUrl, fileName);
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
