import { useState, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OptionsPanel } from './components/layout/OptionsPanel';
import { EmailPreview } from './components/editor/EmailPreview';
import { EditorNavbar } from './components/editor/EditorNavbar';
import { TemplateList } from './components/settings/TemplateList';
import { TemplateEditor } from './components/settings/TemplateEditor';
import { useTemplates } from './hooks/useSupabase';
import type { GlobalStyleTemplate } from './types/firebase';

function App() {
  const [currentPage, setCurrentPage] = useState<'editor' | 'settings'>('editor');
  const [editingTemplate, setEditingTemplate] = useState<GlobalStyleTemplate | null>(null);
  const sectionsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const { updateTemplate } = useTemplates();


  return (
    <div className="w-screen h-screen flex bg-gray-100 overflow-hidden">
      {/* 1. Navbar gauche - largeur fixe */}
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {currentPage === 'editor' ? (
        <>
          {/* 2. Sidebar sections - largeur fixe */}
          <Sidebar />
          
          {/* 3. Zone centrale - flex 1, avec navbar en haut */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <EditorNavbar />
            <main className="flex-1 flex justify-center items-center overflow-y-auto p-8">
              <EmailPreview sectionsRef={sectionsRef} />
            </main>
          </div>

          {/* 4. Options Panel droite - largeur fixe, conditionnel */}
          <OptionsPanel sectionsRef={sectionsRef} />
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
  );
}

export default App;
