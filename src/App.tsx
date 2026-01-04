import { useState, useRef } from 'react';
import { Eye, Download, Loader2 } from 'lucide-react';
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const sectionsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const toast = useToast();
  
  const { updateTemplate } = useTemplates();
  const { templates } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();
  const { sections, selectedSectionId, currentTemplateId, addSection, selectSection } = useEmailStore();
  
  // Gérer le début de la sélection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.metaKey) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsSelecting(true);
    setSelectionStart({ x: e.clientX, y: e.clientY });
    setSelectionEnd({ x: e.clientX, y: e.clientY });
    setSelectedSectionsForExport(new Set());
  };
  
  // Gérer le mouvement de la souris
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart) return;
    
    e.preventDefault();
    setSelectionEnd({ x: e.clientX, y: e.clientY });
    
    // Détecter les sections dans le cadre de sélection
    const selectionRect = {
      left: Math.min(selectionStart.x, e.clientX),
      right: Math.max(selectionStart.x, e.clientX),
      top: Math.min(selectionStart.y, e.clientY),
      bottom: Math.max(selectionStart.y, e.clientY),
    };
    
    const newSelectedSections = new Set<string>();
    sections.forEach(section => {
      const element = sectionsRef.current?.get(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (
          rect.left < selectionRect.right &&
          rect.right > selectionRect.left &&
          rect.top < selectionRect.bottom &&
          rect.bottom > selectionRect.top
        ) {
          newSelectedSections.add(section.id);
        }
      }
    });
    
    setSelectedSectionsForExport(newSelectedSections);
  };
  
  // Gérer la fin de la sélection
  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };
  
  // Calculer le style du cadre de sélection
  const getSelectionBoxStyle = (): React.CSSProperties => {
    if (!selectionStart || !selectionEnd) return { display: 'none' };
    
    const left = Math.min(selectionStart.x, selectionEnd.x);
    const top = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);
    
    return {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: '2px dashed #8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      pointerEvents: 'none',
      zIndex: 1000,
    };
  };

  const handleExportSelectedSections = async () => {
    if (selectedSectionsForExport.size === 0 || !sectionsRef.current) return;
    
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
      
      const fileName = `export-${selectedSectionsForExport.size}-sections-${Date.now()}.jpg`;
      
      // Sauvegarder la sélection actuelle
      const savedSelection = new Set(selectedSectionsForExport);
      
      // Désélectionner temporairement pour retirer les bordures vertes
      setSelectedSectionsForExport(new Set());
      
      // Attendre que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await exportMultipleSections({
        sectionIds: sortedSectionIds,
        sectionsRef: sectionsRef.current,
        backgroundImageUrl,
        backgroundSize,
        fileName,
      });
      
      // Resélectionner les sections
      setSelectedSectionsForExport(savedSelection);
      
      toast.success(`${savedSelection.size} section(s) exportée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur export multi-sections:', error);
      toast.error('Erreur lors de l\'export des sections');
      // Réinitialiser la sélection en cas d'erreur
      setSelectedSectionsForExport(new Set());
    } finally {
      setExportingMultiple(false);
    }
  };
  
  const handleExportSeparateSections = async () => {
    if (selectedSectionsForExport.size === 0 || !sectionsRef.current) return;
    
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
      
      // Sauvegarder la sélection actuelle
      const savedSelection = new Set(selectedSectionsForExport);
      
      // Désélectionner temporairement pour retirer les bordures vertes
      setSelectedSectionsForExport(new Set());
      
      // Attendre que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
      
      // Resélectionner les sections
      setSelectedSectionsForExport(savedSelection);
      
      toast.success(`${savedSelection.size} section(s) exportée(s) individuellement avec succès !`);
    } catch (error) {
      console.error('Erreur export sections séparées:', error);
      toast.error('Erreur lors de l\'export des sections');
      // Réinitialiser la sélection en cas d'erreur
      setSelectedSectionsForExport(new Set());
    } finally {
      setExportingMultiple(false);
    }
  };

  const handleSelectSectionType = (sectionType: SectionTemplate) => {
    const newSection: EmailSection = {
      id: `section-${Date.now()}`,
      templateId: sectionType.id,
      name: `Section ${sections.length + 1}`,
      content: sectionType.defaultContent,
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
          <Sidebar onOpenTemplateSelector={() => setShowTemplateSelector(true)} />
          
          {/* 3. Zone centrale - flex 1, avec navbar en haut */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <EditorNavbar />
            <main 
              className="flex-1 flex justify-center items-center overflow-y-auto p-8 relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ userSelect: 'none' }}
            >
              {/* Cadre de sélection visuel */}
              {isSelecting && <div style={getSelectionBoxStyle()} />}
              {/* Boutons en haut à gauche */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                {/* Bouton de visualisation */}
                {selectedSectionId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSection(null);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 hover:border-[#1E90FF] transition-all"
                    title="Mode visualisation (désélectionner la section)"
                  >
                    <Eye size={16} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">Visualiser</span>
                  </button>
                )}
                
                {/* Boutons d'export multi-sections */}
                {selectedSectionsForExport.size > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSelectedSections();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSeparateSections();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
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
              
              <EmailPreview 
                sectionsRef={sectionsRef}
                selectedSections={selectedSectionsForExport}
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

