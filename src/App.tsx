import { useState, useRef } from 'react';
import { Eye, Download, Loader2, CheckSquare } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OptionsPanel } from './components/layout/OptionsPanel';
import { TemplateSelectorPanel } from './components/layout/TemplateSelectorPanel';
import { EmailPreview } from './components/editor/EmailPreview';
import { EditorNavbar } from './components/editor/EditorNavbar';
import { FontLoader } from './components/editor/FontLoader';
import { TemplateList } from './components/settings/TemplateList';
import { TemplateEditor } from './components/settings/TemplateEditor';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { useTemplates, useSectionTemplates } from './hooks/useSupabase';
import { useEmailStore } from './store/emailStore';
import { exportMultipleSections } from './utils/exportMultipleSections';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import type { GlobalStyleTemplate, SectionTemplate } from './types/supabase';
import type { EmailSection } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'editor' | 'settings'>('editor');
  const [editingTemplate, setEditingTemplate] = useState<GlobalStyleTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedSectionsForExport, setSelectedSectionsForExport] = useState<Set<string>>(new Set());
  const [exportingMultiple, setExportingMultiple] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const sectionsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const toast = useToast();
  
  const { updateTemplate } = useTemplates();
  const { templates } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();
  const { sections, selectedSectionId, currentTemplateId, addSection, selectSection } = useEmailStore();
  
  // Toggle une section dans la sélection pour export
  const toggleSectionForExport = (sectionId: string) => {
    setSelectedSectionsForExport(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Sélectionner / désélectionner toutes les sections
  const toggleSelectAll = () => {
    if (selectedSectionsForExport.size === sections.length) {
      setSelectedSectionsForExport(new Set());
    } else {
      setSelectedSectionsForExport(new Set(sections.map(s => s.id)));
    }
  };

  const handleExportSelectedSections = async () => {
    console.log('=== handleExportSelectedSections appelé ===');
    console.log('selectedSectionsForExport.size:', selectedSectionsForExport.size);
    console.log('sectionsRef.current:', sectionsRef.current);
    console.log('sectionsRef.current?.size:', sectionsRef.current?.size);
    
    if (selectedSectionsForExport.size === 0) {
      console.log('ERREUR: Aucune section sélectionnée');
      return;
    }
    if (!sectionsRef.current) {
      console.log('ERREUR: sectionsRef.current est null');
      return;
    }
    
    const sectionsCount = selectedSectionsForExport.size;
    console.log('Début export de', sectionsCount, 'sections');
    
    try {
      setExportingMultiple(true);
      
      // Trier les sections par ordre
      const sortedSectionIds = Array.from(selectedSectionsForExport).sort((a, b) => {
        const sectionA = sections.find(s => s.id === a);
        const sectionB = sections.find(s => s.id === b);
        return (sectionA?.order ?? 0) - (sectionB?.order ?? 0);
      });
      
      const currentTemplate = templates.find(t => t.id === currentTemplateId);
      const backgroundImageUrl = currentTemplate?.backgroundImage;
      const backgroundSize = currentTemplate?.backgroundSize || 'cover';
      
      const fileName = `export-${sectionsCount}-sections-${Date.now()}.jpg`;
      
      await exportMultipleSections({
        sectionIds: sortedSectionIds,
        sectionsRef: sectionsRef.current,
        backgroundImageUrl,
        backgroundSize,
        fileName,
      });
      
      toast.success(`${sectionsCount} section(s) exportée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur export multi-sections:', error);
      toast.error('Erreur lors de l\'export des sections');
    } finally {
      setExportingMultiple(false);
    }
  };

  // Exporter TOUTES les sections en une seule image
  const handleExportAll = async () => {
    if (sections.length === 0 || !sectionsRef.current) return;
    
    try {
      setExportingMultiple(true);
      
      // Toutes les sections triées par ordre (spread pour ne pas muter le state)
      const sortedSectionIds = [...sections]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(s => s.id);
      
      const currentTemplate = templates.find(t => t.id === currentTemplateId);
      const backgroundImageUrl = currentTemplate?.backgroundImage;
      const backgroundSize = currentTemplate?.backgroundSize || 'cover';
      
      const fileName = `export-all-${sections.length}-sections-${Date.now()}.jpg`;
      
      await exportMultipleSections({
        sectionIds: sortedSectionIds,
        sectionsRef: sectionsRef.current,
        backgroundImageUrl,
        backgroundSize,
        fileName,
      });
      
      toast.success(`${sections.length} section(s) exportée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur export toutes sections:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExportingMultiple(false);
    }
  };
  
  const handleExportSeparateSections = async () => {
    if (selectedSectionsForExport.size === 0 || !sectionsRef.current) return;
    
    const sectionsCount = selectedSectionsForExport.size;
    
    try {
      setExportingMultiple(true);
      
      // Trier les sections par ordre
      const sortedSectionIds = Array.from(selectedSectionsForExport).sort((a, b) => {
        const sectionA = sections.find(s => s.id === a);
        const sectionB = sections.find(s => s.id === b);
        return (sectionA?.order ?? 0) - (sectionB?.order ?? 0);
      });
      
      const currentTemplate = templates.find(t => t.id === currentTemplateId);
      const backgroundImageUrl = currentTemplate?.backgroundImage;
      const backgroundSize = currentTemplate?.backgroundSize || 'cover';
      
      console.log(`Début export de ${sortedSectionIds.length} sections séparées`);
      
      // Importer la fonction d'export individuel
      const { exportSectionWithBackground } = await import('./utils/exportWithBackground');
      
      // Exporter chaque section individuellement
      for (let i = 0; i < sortedSectionIds.length; i++) {
        const sectionId = sortedSectionIds[i];
        const element = sectionsRef.current.get(sectionId);
        
        if (element) {
          console.log(`Export section ${i + 1}/${sortedSectionIds.length}`);
          
          const section = sections.find(s => s.id === sectionId);
          const fileName = `section-${i + 1}-${section?.name || 'sans-nom'}-${Date.now() + i}.jpg`;
          
          try {
            await exportSectionWithBackground({
              element,
              backgroundImageUrl,
              backgroundSize,
              fileName,
            });
            
            console.log(`Section ${i + 1} exportée avec succès`);
          } catch (error) {
            console.error(`Erreur export section ${i + 1}:`, error);
          }
          
          // Attendre entre chaque export pour laisser le temps au navigateur
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      console.log('Export terminé');
      
      toast.success(`${sectionsCount} section(s) exportée(s) individuellement avec succès !`);
    } catch (error) {
      console.error('Erreur export sections séparées:', error);
      toast.error('Erreur lors de l\'export des sections');
    } finally {
      setExportingMultiple(false);
    }
  };

  const handleSelectSectionType = (sectionType: SectionTemplate) => {
    const currentTemplate = templates.find(t => t.id === currentTemplateId);
    
    // Créer le contenu de base depuis le template de section
    const baseContent = { ...sectionType.defaultContent };
    
    // Si le contenu a des options et qu'un template est actif, initialiser avec les paddings du template
    if (baseContent.options && currentTemplate) {
      baseContent.options = {
        ...baseContent.options,
        paddingTop: currentTemplate.paddingBlock,
        paddingBottom: currentTemplate.paddingBlock,
        paddingLeft: currentTemplate.paddingInline,
        paddingRight: currentTemplate.paddingInline,
        useTemplatePaddingInline: false,
        useTemplatePaddingBlock: false,
      };
    }
    
    const newSection: EmailSection = {
      id: `section-${Date.now()}`,
      templateId: sectionType.id,
      name: `Section ${sections.length + 1}`,
      content: baseContent,
      order: sections.length,
    };
    addSection(newSection);
    selectSection(newSection.id);
    setShowTemplateSelector(false);
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.closeToast} />
      <div className="w-screen h-screen flex bg-gray-100 overflow-hidden">
        {/* 1. Navbar gauche - largeur fixe */}
        <Navbar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

      {currentPage === 'editor' ? (
        <>
          {/* Charger les Google Fonts du template actuel */}
          <FontLoader />
          
          {/* 2. Sidebar sections - largeur fixe */}
          <Sidebar 
            onOpenTemplateSelector={() => setShowTemplateSelector(true)} 
            onExportAll={handleExportAll}
          />
          
          {/* 3. Zone centrale - flex 1, avec navbar en haut */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <EditorNavbar />
            {/* Barre d'outils fixe au-dessus du contenu scrollable */}
            {(selectedSectionId || sections.length > 1) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0 flex-wrap">
                {/* Bouton de visualisation */}
                {selectedSectionId && (
                  <button
                    onClick={() => selectSection(null)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 hover:border-[#1E90FF] transition-all"
                    title="Mode visualisation (désélectionner la section)"
                  >
                    <Eye size={16} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">Visualiser</span>
                  </button>
                )}
                
                {/* Bouton de sélection multiple */}
                {sections.length > 1 && (
                  <button
                    onClick={() => {
                      setMultiSelectMode(!multiSelectMode);
                      if (multiSelectMode) {
                        setSelectedSectionsForExport(new Set());
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm transition-all ${
                      multiSelectMode
                        ? 'bg-[#FFA500] text-white border border-[#FFA500] hover:bg-[#FF8C00]'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-[#1E90FF]'
                    }`}
                    title={multiSelectMode ? "Désactiver la sélection multiple" : "Activer la sélection multiple"}
                  >
                    <CheckSquare size={16} />
                    <span className="text-xs font-medium">
                      {multiSelectMode ? `${selectedSectionsForExport.size} sélectionnée(s)` : 'Sélectionner plusieurs'}
                    </span>
                  </button>
                )}

                {/* Bouton tout sélectionner */}
                {multiSelectMode && (
                  <button
                    onClick={() => toggleSelectAll()}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 hover:border-[#1E90FF] transition-all"
                    title={selectedSectionsForExport.size === sections.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  >
                    <CheckSquare size={16} />
                    <span className="text-xs font-medium">
                      {selectedSectionsForExport.size === sections.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </span>
                  </button>
                )}
                
                {/* Boutons d'export multi-sections */}
                {(selectedSectionsForExport.size > 1 || exportingMultiple) && (
                  <>
                    <button
                      onClick={() => handleExportSelectedSections()}
                      disabled={exportingMultiple}
                      className="flex items-center gap-2 px-3 py-2 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                      title={`Exporter ${selectedSectionsForExport.size} sections en 1 JPG`}
                    >
                      {exportingMultiple ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-xs font-medium">Export...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span className="text-xs font-medium">Exporter en 1 image</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleExportSeparateSections()}
                      disabled={exportingMultiple}
                      className="flex items-center gap-2 px-3 py-2 bg-[#FFA500] text-white rounded-lg shadow-md hover:bg-[#FF8C00] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                      title={`Exporter ${selectedSectionsForExport.size} sections en ${selectedSectionsForExport.size} JPG`}
                    >
                      {exportingMultiple ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-xs font-medium">Export...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span className="text-xs font-medium">Exporter en {selectedSectionsForExport.size} images</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            <main 
              className="flex-1 flex justify-center items-start overflow-y-auto p-8"
            >
              <EmailPreview 
                sectionsRef={sectionsRef}
                selectedSections={selectedSectionsForExport}
                multiSelectMode={multiSelectMode}
                onToggleSection={toggleSectionForExport}
              />
            </main>
          </div>

          {/* 4. Options Panel droite - largeur fixe, conditionnel */}
          {showTemplateSelector ? (
            <TemplateSelectorPanel
              sectionTypes={sectionTemplates}
              onSelectSectionType={handleSelectSectionType}
              onClose={() => setShowTemplateSelector(false)}
            />
          ) : (
            <OptionsPanel sectionsRef={sectionsRef} />
          )}
        </>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          {editingTemplate ? (
            <TemplateEditor
              template={editingTemplate}
              onSave={async (updates) => {
                await updateTemplate(editingTemplate.id, updates);
                setEditingTemplate(null);
              }}
              onBack={() => setEditingTemplate(null)}
            />
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Réglages</h1>
              
              <TemplateList onSelectTemplate={setEditingTemplate} />
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <AppContent />
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;

