import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';
import { SectionRenderer } from './SectionRenderer';
import './EmailPreview.css';

interface EmailPreviewProps {
  sectionsRef: React.RefObject<Map<string, HTMLDivElement> | null>;
  selectedSections: Set<string>;
}

export function EmailPreview({ sectionsRef, selectedSections }: EmailPreviewProps) {
  const { sections, selectedSectionId, selectSection, currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  const backgroundImage = currentTemplate?.backgroundImage || '';
  const backgroundSize = currentTemplate?.backgroundSize || 'cover';

  // Générer le CSS global pour les polices, tailles et couleurs du template
  const globalFontCSS = currentTemplate ? `
    .email-preview-container p {
      font-family: ${currentTemplate.fonts.paragraph} !important;
      font-size: ${currentTemplate.tagFontSizes?.p || 16}px !important;
      ${currentTemplate.tagColors?.p ? `color: ${currentTemplate.tagColors.p} !important;` : ''}
    }
    .email-preview-container h1 {
      font-family: ${currentTemplate.fonts.title} !important;
      font-size: ${currentTemplate.tagFontSizes?.h1 || 32}px !important;
      ${currentTemplate.tagColors?.h1 ? `color: ${currentTemplate.tagColors.h1} !important;` : ''}
    }
    .email-preview-container h2 {
      font-family: ${currentTemplate.fonts.title} !important;
      font-size: ${currentTemplate.tagFontSizes?.h2 || 24}px !important;
      ${currentTemplate.tagColors?.h2 ? `color: ${currentTemplate.tagColors.h2} !important;` : ''}
    }
    .email-preview-container h3 {
      font-family: ${currentTemplate.fonts.title} !important;
      font-size: ${currentTemplate.tagFontSizes?.h3 || 20}px !important;
      ${currentTemplate.tagColors?.h3 ? `color: ${currentTemplate.tagColors.h3} !important;` : ''}
    }
    .email-preview-container h4 {
      font-family: ${currentTemplate.fonts.title} !important;
      font-size: ${currentTemplate.tagFontSizes?.h4 || 18}px !important;
      ${currentTemplate.tagColors?.h4 ? `color: ${currentTemplate.tagColors.h4} !important;` : ''}
    }
    .email-preview-container h5 {
      font-family: ${currentTemplate.fonts.title} !important;
      font-size: ${currentTemplate.tagFontSizes?.h5 || 16}px !important;
      ${currentTemplate.tagColors?.h5 ? `color: ${currentTemplate.tagColors.h5} !important;` : ''}
    }
  ` : '';

  return (
    <div className="w-full max-w-2xl p-1">
      {/* Injecter le CSS global pour les polices */}
      {globalFontCSS && (
        <style dangerouslySetInnerHTML={{ __html: globalFontCSS }} />
      )}
      
      <div 
        className={`bg-white rounded-lg shadow-2xl ${backgroundImage ? 'email-preview-container' : ''}`}
        style={backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: backgroundSize === 'cover' ? 'cover' : '100% auto',
        } : undefined}
      >
        {sortedSections.length === 0 ? (
          <div className="h-96 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-400 text-lg">Aucune section</p>
              <p className="text-gray-300 text-sm mt-2">
                Ajoutez des sections depuis le panneau de gauche
              </p>
            </div>
          </div>
        ) : (
          sortedSections.map((section) => (
            <div
              key={section.id}
              data-section-id={section.id}
              ref={(el) => {
                if (el && sectionsRef.current) {
                  sectionsRef.current.set(section.id, el);
                }
              }}
              onClick={() => selectSection(section.id)}
              className={`cursor-pointer transition-all ${
                selectedSections.has(section.id)
                  ? 'ring-4 ring-[#FFA500]'
                  : selectedSectionId === section.id
                  ? 'ring-2 ring-[#1E90FF]'
                  : 'hover:ring-2 hover:ring-[#00BFFF]'
              }`}
            >
              <SectionRenderer section={section} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
