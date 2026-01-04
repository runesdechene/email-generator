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

  return (
    <div className="w-full max-w-2xl">
      <div 
        className={`bg-white rounded-lg shadow-2xl overflow-hidden ${backgroundImage ? 'email-preview-container' : ''}`}
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
                  ? 'ring-4 ring-emerald-500 ring-inset'
                  : selectedSectionId === section.id
                  ? 'ring-2 ring-violet-500 ring-inset'
                  : 'hover:ring-2 hover:ring-violet-300 hover:ring-inset'
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
