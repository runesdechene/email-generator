import { useState } from 'react';
import { Plus, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { useTemplates } from '../../hooks/useSupabase';
import type { GlobalStyleTemplate } from '../../types/firebase';

interface TemplateListProps {
  onSelectTemplate: (template: GlobalStyleTemplate) => void;
}

export function TemplateList({ onSelectTemplate }: TemplateListProps) {
  const { templates, loading, createTemplate, deleteTemplate } = useTemplates();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!templateName.trim()) {
      alert('Veuillez entrer un nom de template');
      return;
    }

    try {
      setCreating(true);
      await createTemplate({
        name: templateName,
        description: '',
        backgroundImage: '',
        fonts: {
          title: 'Arial, sans-serif',
          paragraph: 'Arial, sans-serif',
        },
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937',
          accent: '#10b981',
        },
        buttonStyle: {
          borderRadius: '8px',
          backgroundColor: '#6366f1',
          textColor: '#ffffff',
          hoverBackgroundColor: '#4f46e5',
          padding: '12px 24px',
        },
      });
      setShowCreateDialog(false);
      setTemplateName('');
      alert('Template créé avec succès ! Cliquez dessus pour le configurer.');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Erreur lors de la création du template');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Supprimer le template "${name}" ?`)) {
      return;
    }

    try {
      await deleteTemplate(id);
      alert('Template supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erreur lors de la suppression du template');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Feuilles de style globales</h2>
            <p className="text-sm text-gray-500 mt-1">
              Créez et gérez vos templates (Runes de Chêne, Bislkirnir, etc.)
            </p>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all"
          >
            <Plus size={18} />
            Nouveau template
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-violet-600" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun template créé</p>
            <p className="text-sm text-gray-400 mt-2">
              Créez votre premier template pour définir vos styles d'emails
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="border border-gray-200 rounded-lg p-4 hover:border-violet-400 hover:bg-violet-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex gap-1.5">
                        <div 
                          className="w-5 h-5 rounded border border-gray-200" 
                          style={{ backgroundColor: template.colors.primary }} 
                          title="Couleur primaire" 
                        />
                        <div 
                          className="w-5 h-5 rounded border border-gray-200" 
                          style={{ backgroundColor: template.colors.secondary }} 
                          title="Couleur secondaire" 
                        />
                      </div>
                    </div>
                    {template.description && (
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Modifié le {new Date(template.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, template.id, template.name)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-violet-600 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Nouveau template
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du template *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="Runes de Chêne"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Vous pourrez configurer les couleurs et styles après la création
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Créer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setTemplateName('');
                }}
                disabled={creating}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
