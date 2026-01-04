import { useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates, useSectionTemplates } from '../../hooks/useSupabase';
import { exportSectionWithBackground } from '../../utils/exportWithBackground';

interface OptionsPanelProps {
  sectionsRef: React.RefObject<Map<string, HTMLDivElement>>;
}

export function OptionsPanel({ sectionsRef }: OptionsPanelProps) {
  const { selectedSectionId, sections, currentTemplateId, selectSection, updateSection } = useEmailStore();
  const { templates } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();
  const [exporting, setExporting] = useState(false);
  
  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const sectionType = sectionTemplates.find(t => t.id === selectedSection?.templateId);

  if (!selectedSection) {
    return null;
  }

  const updateContent = (field: string, value: any) => {
    updateSection(selectedSection.id, {
      content: {
        ...selectedSection.content,
        [field]: value,
      },
    });
  };

  const updateOption = (path: string[], value: any) => {
    const options = { ...(selectedSection.content.options as any) || {} };
    let current = options;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    
    updateSection(selectedSection.id, {
      content: {
        ...selectedSection.content,
        options,
      },
    });
  };

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

        {sectionType && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
            <p className="text-xs text-violet-600">
              <span className="font-semibold">Type :</span> {sectionType.name}
            </p>
          </div>
        )}

        {sectionType?.name === 'Texte' && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Contenu</h3>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
                rows={6}
                placeholder="<p>Votre contenu HTML ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Padding (px)
              </label>
              <input
                type="number"
                value={(selectedSection.content.options as any)?.padding ?? 32}
                onChange={(e) => updateOption(['padding'], parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Police
              </label>
              <select
                value={(selectedSection.content.options as any)?.fontFamily ?? 'paragraph'}
                onChange={(e) => updateOption(['fontFamily'], e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              >
                <option value="paragraph">Paragraph (du template)</option>
                <option value="heading">Heading (du template)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Taille de police (px)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={(selectedSection.content.options as any)?.fontSize ?? 16}
                  onChange={(e) => updateOption(['fontSize'], parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={(selectedSection.content.options as any)?.fontSize ?? 16}
                  onChange={(e) => updateOption(['fontSize'], parseInt(e.target.value) || 16)}
                  className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Couleur
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(selectedSection.content.options as any)?.color ?? '#000000'}
                  onChange={(e) => updateOption(['color'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={(selectedSection.content.options as any)?.color ?? '#000000'}
                  onChange={(e) => updateOption(['color'], e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-3">Style du texte</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Alignement
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['left', 'center', 'right', 'justify'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateOption(['textStyle', 'align'], align)}
                        className={`px-2 py-1.5 text-xs rounded border transition-all ${
                          ((selectedSection.content.options as any)?.textStyle?.align ?? 'left') === align
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-violet-400'
                        }`}
                      >
                        {align === 'left' && 'Left'}
                        {align === 'center' && 'Center'}
                        {align === 'right' && 'Right'}
                        {align === 'justify' && 'Justify'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Line Height
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={(selectedSection.content.options as any)?.textStyle?.lineHeight ?? 1.6}
                    onChange={(e) => updateOption(['textStyle', 'lineHeight'], parseFloat(e.target.value) || 1.6)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Letter Spacing (px)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={(selectedSection.content.options as any)?.textStyle?.letterSpacing ?? 0}
                    onChange={(e) => updateOption(['textStyle', 'letterSpacing'], parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">CSS personnalisé</h3>
              <textarea
                value={(selectedSection.content.options as any)?.customCSS ?? ''}
                onChange={(e) => updateOption(['customCSS'], e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
                rows={4}
                placeholder="color: #333; font-size: 16px;"
              />
              <p className="text-xs text-gray-400 mt-1">Format CSS (sans accolades)</p>
            </div>
          </>
        )}

        {sectionType?.name !== 'Texte' && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xs font-semibold text-gray-700 mb-4">Contenu</h3>
            <p className="text-xs text-gray-500">
              Les options de contenu pour ce type de section ne sont pas encore disponibles.
            </p>
          </div>
        )}
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
