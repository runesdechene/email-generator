import { useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';
import { exportSectionWithBackground } from '../../utils/exportWithBackground';

interface OptionsPanelProps {
  sectionsRef: React.RefObject<Map<string, HTMLDivElement>>;
}

export function OptionsPanel({ sectionsRef }: OptionsPanelProps) {
  const { selectedSectionId, sections, currentTemplateId, selectSection, updateSection } = useEmailStore();
  const { templates } = useTemplates();
  const [exporting, setExporting] = useState(false);
  
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return null;
  }

  return (
    <aside className="w-80 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Options de la section</h2>
        <button
          onClick={() => selectSection(null)}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Nom de la section
          </label>
          <input
            type="text"
            value={selectedSection.name}
            onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Template de section
          </label>
          <select
            value={selectedSection.templateId}
            onChange={(e) => updateSection(selectedSection.id, { templateId: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="hero">Hero Banner</option>
            <option value="text">Bloc Texte</option>
            <option value="image">Image</option>
            <option value="cta">Call to Action</option>
            <option value="product">Produit</option>
            <option value="footer">Footer</option>
          </select>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xs font-semibold text-gray-700 mb-4">Contenu</h3>
          <p className="text-xs text-gray-500">
            Les options de contenu dépendront du template sélectionné.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={async () => {
            if (!selectedSection) return;
            
            const element = sectionsRef.current?.get(selectedSection.id);
            if (!element) {
              alert('Impossible de trouver la section à exporter');
              return;
            }

            try {
              setExporting(true);
              
              const currentTemplate = templates.find(t => t.id === currentTemplateId);
              const backgroundImageUrl = currentTemplate?.backgroundImage;
              const backgroundSize = currentTemplate?.backgroundSize || 'cover';
              
              const fileName = `${selectedSection.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-section-${selectedSection.order + 1}.jpg`;
              
              await exportSectionWithBackground({
                element,
                backgroundImageUrl,
                backgroundSize,
                fileName,
              });
              
              alert('✅ Section exportée avec succès !');
            } catch (error) {
              console.error('Erreur export section:', error);
              alert('❌ Erreur lors de l\'export de la section');
            } finally {
              setExporting(false);
            }
          }}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-wait text-sm font-medium"
        >
          {exporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download size={16} />
              Exporter cette section en JPG
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
