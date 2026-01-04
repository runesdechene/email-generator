import { useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates, useSectionTemplates } from '../../hooks/useSupabase';
import { exportSectionWithBackground } from '../../utils/exportWithBackground';
import { useToast } from '../../hooks/useToast';

interface OptionsPanelProps {
  sectionsRef: React.RefObject<Map<string, HTMLDivElement>>;
}

export function OptionsPanel({ sectionsRef }: OptionsPanelProps) {
  const { selectedSectionId, sections, currentTemplateId, selectSection, updateSection } = useEmailStore();
  const { templates } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();
  const toast = useToast();
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
    // Copie profonde des options pour éviter les mutations
    const options = JSON.parse(JSON.stringify((selectedSection.content.options as any) || {}));
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
    <aside className="w-100 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
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
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          />
        </div>

        {sectionType && (
          <div className="bg-blue-50 border border-[#1E90FF] rounded-lg px-3 py-2">
            <p className="text-xs text-[#1E90FF] font-medium">
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
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
                rows={6}
                placeholder="<p>Votre contenu HTML ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Padding
              </label>
              
              {/* Toggles pour utiliser les paddings du template */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => updateOption(['useTemplatePaddingInline'], !(selectedSection.content.options as any)?.useTemplatePaddingInline)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-all ${
                    (selectedSection.content.options as any)?.useTemplatePaddingInline
                      ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                  }`}
                  title="Utiliser le padding inline du template (gauche/droite)"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m10 8V8M5 12h14" />
                  </svg>
                  Inline
                </button>
                <button
                  onClick={() => updateOption(['useTemplatePaddingBlock'], !(selectedSection.content.options as any)?.useTemplatePaddingBlock)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-all ${
                    (selectedSection.content.options as any)?.useTemplatePaddingBlock
                      ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                  }`}
                  title="Utiliser le padding block du template (haut/bas)"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5m8 2V5M12 5v14m-4 2h8M7 12h10" />
                  </svg>
                  Block
                </button>
              </div>

              {/* Paddings 4 directions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Haut</label>
                  <input
                    type="number"
                    value={(selectedSection.content.options as any)?.paddingTop ?? 32}
                    onChange={(e) => updateOption(['paddingTop'], parseInt(e.target.value) || 0)}
                    disabled={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bas</label>
                  <input
                    type="number"
                    value={(selectedSection.content.options as any)?.paddingBottom ?? 32}
                    onChange={(e) => updateOption(['paddingBottom'], parseInt(e.target.value) || 0)}
                    disabled={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gauche</label>
                  <input
                    type="number"
                    value={(selectedSection.content.options as any)?.paddingLeft ?? 32}
                    onChange={(e) => updateOption(['paddingLeft'], parseInt(e.target.value) || 0)}
                    disabled={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Droite</label>
                  <input
                    type="number"
                    value={(selectedSection.content.options as any)?.paddingRight ?? 32}
                    onChange={(e) => updateOption(['paddingRight'], parseInt(e.target.value) || 0)}
                    disabled={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Police
              </label>
              <select
                value={(selectedSection.content.options as any)?.fontFamily ?? 'paragraph'}
                onChange={(e) => updateOption(['fontFamily'], e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
              >
                <option value="paragraph">Paragraph (du template)</option>
                <option value="heading">Heading (du template)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Taille de police
              </label>
              
              {/* Sélection : Variable du template ou personnalisée */}
              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => {
                      const currentSize = (selectedSection.content.options as any)?.fontSize;
                      if (typeof currentSize === 'number') {
                        updateOption(['fontSize'], 'm');
                      }
                    }}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      typeof (selectedSection.content.options as any)?.fontSize === 'string'
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    Variable du template
                  </button>
                  <button
                    onClick={() => {
                      const currentSize = (selectedSection.content.options as any)?.fontSize;
                      if (typeof currentSize === 'string') {
                        updateOption(['fontSize'], 16);
                      }
                    }}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      typeof (selectedSection.content.options as any)?.fontSize === 'number' || (selectedSection.content.options as any)?.fontSize === undefined
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    Taille personnalisée
                  </button>
                </div>
              </div>

              {/* Si variable du template : afficher les tailles disponibles */}
              {typeof (selectedSection.content.options as any)?.fontSize === 'string' && (
                <div className="grid grid-cols-3 gap-2">
                  {(['xxl', 'xl', 'l', 'm', 's', 'xs'] as const).map((sizeKey) => {
                    const currentTemplate = templates.find(t => t.id === currentTemplateId);
                    const sizeValue = currentTemplate?.fontSizes[sizeKey] || 16;
                    const isSelected = (selectedSection.content.options as any)?.fontSize === sizeKey;
                    
                    return (
                      <button
                        key={sizeKey}
                        onClick={() => updateOption(['fontSize'], sizeKey)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-[#1E90FF] bg-blue-50 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                        }`}
                      >
                        <p className={`font-semibold ${
                          isSelected ? 'text-[#1E90FF]' : 'text-gray-900'
                        }`}>{sizeKey.toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{sizeValue}px</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Si taille personnalisée : afficher le range + input */}
              {(typeof (selectedSection.content.options as any)?.fontSize === 'number' || (selectedSection.content.options as any)?.fontSize === undefined) && (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={(selectedSection.content.options as any)?.fontSize ?? 16}
                    onChange={(e) => updateOption(['fontSize'], parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                  />
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={(selectedSection.content.options as any)?.fontSize ?? 16}
                    onChange={(e) => updateOption(['fontSize'], parseInt(e.target.value) || 16)}
                    className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Couleur
              </label>
              
              {/* Sélection : Couleur du template ou personnalisée */}
              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => {
                      const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                      const currentTemplate = templates.find(t => t.id === currentTemplateId);
                      const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                      if (!allTemplateColors.includes(currentColor)) {
                        updateOption(['color'], 'primary');
                      }
                    }}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      (() => {
                        const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                        const currentTemplate = templates.find(t => t.id === currentTemplateId);
                        const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                        return allTemplateColors.includes(currentColor)
                          ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]';
                      })()
                    }`}
                  >
                    Variable du template
                  </button>
                  <button
                    onClick={() => {
                      const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                      const currentTemplate = templates.find(t => t.id === currentTemplateId);
                      const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                      if (allTemplateColors.includes(currentColor)) {
                        updateOption(['color'], '#000000');
                      }
                    }}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      (() => {
                        const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                        const currentTemplate = templates.find(t => t.id === currentTemplateId);
                        const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                        return !allTemplateColors.includes(currentColor)
                          ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]';
                      })()
                    }`}
                  >
                    Couleur personnalisée
                  </button>
                </div>
              </div>

              {/* Si variable du template : afficher les couleurs disponibles */}
              {(() => {
                const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                const currentTemplate = templates.find(t => t.id === currentTemplateId);
                const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                return allTemplateColors.includes(currentColor);
              })() && (
                <div>
                  {/* Couleurs principales */}
                  <p className="text-xs text-gray-500 mb-2">Couleurs principales</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {(['primary', 'secondary', 'background', 'text', 'accent'] as const).map((colorKey) => {
                      const currentTemplate = templates.find(t => t.id === currentTemplateId);
                      const colorValue = currentTemplate?.colors[colorKey] || '#000000';
                      const isSelected = (selectedSection.content.options as any)?.color === colorKey;
                      
                      return (
                        <button
                          key={colorKey}
                          onClick={() => updateOption(['color'], colorKey)}
                          className={`relative aspect-square rounded-lg border-2 transition-all ${
                            isSelected ? 'border-[#1E90FF] ring-2 ring-blue-200 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                          }`}
                          style={{ backgroundColor: colorValue }}
                          title={`${colorKey}: ${colorValue}`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Couleurs personnalisées */}
                  {(() => {
                    const currentTemplate = templates.find(t => t.id === currentTemplateId);
                    return currentTemplate?.customColors && currentTemplate.customColors.length > 0;
                  })() && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Couleurs personnalisées</p>
                      <div className="grid grid-cols-5 gap-2">
                        {templates.find(t => t.id === currentTemplateId)?.customColors?.map((customColor) => {
                          const isSelected = (selectedSection.content.options as any)?.color === customColor.name;
                          
                          return (
                            <button
                              key={customColor.name}
                              onClick={() => updateOption(['color'], customColor.name)}
                              className={`relative aspect-square rounded-lg border-2 transition-all ${
                                isSelected ? 'border-[#1E90FF] ring-2 ring-blue-200 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                              }`}
                              style={{ backgroundColor: customColor.value }}
                              title={`${customColor.name}: ${customColor.value}`}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Si couleur personnalisée : afficher le color picker */}
              {(() => {
                const currentColor = (selectedSection.content.options as any)?.color ?? '#000000';
                const currentTemplate = templates.find(t => t.id === currentTemplateId);
                const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
                return !allTemplateColors.includes(currentColor);
              })() && (
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
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                    placeholder="#000000"
                  />
                </div>
              )}
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
                            ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
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
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
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
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">CSS personnalisé</h3>
              <textarea
                value={(selectedSection.content.options as any)?.customCSS ?? ''}
                onChange={(e) => updateOption(['customCSS'], e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
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
              toast.error('Impossible de trouver la section à exporter');
              return;
            }

            try {
              setExporting(true);
              
              // Sauvegarder l'ID de la section sélectionnée
              const currentSelectedId = selectedSection.id;
              
              // Désélectionner temporairement pour retirer la bordure violette
              selectSection(null);
              
              // Attendre que le DOM se mette à jour (retrait de la bordure)
              await new Promise(resolve => setTimeout(resolve, 100));
              
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
              
              // Resélectionner la section après l'export
              selectSection(currentSelectedId);
              
              toast.success('Section exportée avec succès !');
            } catch (error) {
              console.error('Erreur export section:', error);
              toast.error('Erreur lors de l\'export de la section');
              // Resélectionner la section même en cas d'erreur
              if (selectedSection) {
                selectSection(selectedSection.id);
              }
            } finally {
              setExporting(false);
            }
          }}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait text-sm font-medium"
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
