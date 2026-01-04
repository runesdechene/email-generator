import { useEffect } from 'react';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';
import { loadGoogleFont } from '../../utils/googleFonts';

/**
 * Composant pour charger dynamiquement les Google Fonts du template actuel
 */
export function FontLoader() {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();

  useEffect(() => {
    const currentTemplate = templates.find(t => t.id === currentTemplateId);
    
    if (currentTemplate) {
      // Charger la font des titres
      if (currentTemplate.fonts.title) {
        loadGoogleFont(currentTemplate.fonts.title);
      }
      
      // Charger la font des paragraphes
      if (currentTemplate.fonts.paragraph) {
        loadGoogleFont(currentTemplate.fonts.paragraph);
      }
    }
  }, [currentTemplateId, templates]);

  return null; // Ce composant ne rend rien
}
