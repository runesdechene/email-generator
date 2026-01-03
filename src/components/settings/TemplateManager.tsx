import { useState } from 'react';
import { Plus, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { useTemplates } from '../../hooks/useFirebase';
import type { GlobalStyleTemplate } from '../../types/firebase';

interface TemplateManagerProps {
  onSelectTemplate: (template: GlobalStyleTemplate) => void;
}

export function TemplateManager({ onSelectTemplate }: TemplateManagerProps) {
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

  const handleDelete = async (id: string, name: string) => {
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
            <h2 className="text-lg font-bold text-gray-900">Templates d'emails</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos templates d'emails (Runes de Chêne, Bislkirnir, etc.)
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
              Créez votre premier template pour organiser vos emails
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: template.colors.primary }} title="Couleur primaire" />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: template.colors.secondary }} title="Couleur secondaire" />
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-1.5 text-gray-400 hover:text-violet-600 transition-all"
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id, template.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {template.description && (
                  <p className="text-sm text-gray-500">{template.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Créé le {new Date(template.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showCreateDialog || editingTemplate) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du template *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Runes de Chêne"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                  rows={3}
                  placeholder="Template pour les emails de la marque Runes de Chêne"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Couleurs</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Primaire</label>
                    <input
                      type="color"
                      value={formData.colors.primary}
                      onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, primary: e.target.value } })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Secondaire</label>
                    <input
                      type="color"
                      value={formData.colors.secondary}
                      onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, secondary: e.target.value } })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fond</label>
                    <input
                      type="color"
                      value={formData.colors.background}
                      onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, background: e.target.value } })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Texte</label>
                    <input
                      type="color"
                      value={formData.colors.text}
                      onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, text: e.target.value } })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingTemplate ? handleUpdate : handleCreate}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {editingTemplate ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingTemplate ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingTemplate(null);
                  resetForm();
                }}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <X size={16} />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
