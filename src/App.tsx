import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OptionsPanel } from './components/layout/OptionsPanel';
import { EmailPreview } from './components/editor/EmailPreview';
import { useEmailStore } from './store/emailStore';

function App() {
  const [currentPage, setCurrentPage] = useState<'editor' | 'settings'>('editor');
  const sectionsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const { sections } = useEmailStore();

  const handleExport = async () => {
    if (sections.length === 0) {
      alert('Aucune section à exporter');
      return;
    }

    for (const section of sections) {
      const element = sectionsRef.current.get(section.id);
      if (element) {
        try {
          const dataUrl = await toPng(element, { quality: 0.95 });
          const link = document.createElement('a');
          link.download = `${section.name.replace(/\s+/g, '-').toLowerCase()}-${section.order + 1}.png`;
          link.href = dataUrl;
          link.click();
        } catch (error) {
          console.error(`Erreur export section ${section.name}:`, error);
        }
      }
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100 overflow-hidden">
      {/* 1. Navbar gauche - largeur fixe */}
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onExport={handleExport}
      />

      {currentPage === 'editor' ? (
        <>
          {/* 2. Sidebar sections - largeur fixe */}
          <Sidebar />
          
          {/* 3. Zone centrale - flex 1, centrée */}
          <main className="flex-1 flex justify-center items-center bg-gray-50 overflow-y-auto p-8">
            <EmailPreview sectionsRef={sectionsRef} />
          </main>

          {/* 4. Options Panel droite - largeur fixe, conditionnel */}
          <OptionsPanel />
        </>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Réglages</h1>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-500">
                Les réglages de la feuille de style globale seront disponibles ici.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
