import { useState } from 'react';
import { Save, FolderOpen, Loader2, Trash2 } from 'lucide-react';
import { useProjects } from '../../hooks/useFirebase';
import { useEmailStore } from '../../store/emailStore';
import type { EmailProject } from '../../types/firebase';

export function ProjectManager() {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const { sections, currentTemplateId } = useEmailStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      alert('Veuillez entrer un nom de projet');
      return;
    }

    try {
      setSaving(true);
      await createProject({
        name: projectName,
        description: projectDescription,
        templateId: currentTemplateId || 'default',
        sections: sections.map(s => ({
          id: s.id,
          templateId: s.templateId,
          name: s.name,
          content: s.content,
          order: s.order,
        })),
      });
      setShowSaveDialog(false);
      setProjectName('');
      setProjectDescription('');
      alert('Projet sauvegardé avec succès !');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erreur lors de la sauvegarde du projet');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadProject = (project: EmailProject) => {
    if (sections.length > 0) {
      if (!confirm('Charger ce projet remplacera votre travail actuel. Continuer ?')) {
        return;
      }
    }

    const { setCurrentTemplate, reorderSections } = useEmailStore.getState();
    setCurrentTemplate(project.templateId);
    reorderSections(project.sections);
    setShowLoadDialog(false);
    alert('Projet chargé avec succès !');
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Supprimer le projet "${name}" ?`)) {
      return;
    }

    try {
      await deleteProject(id);
      alert('Projet supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowSaveDialog(true)}
        className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all text-sm font-medium"
        title="Sauvegarder le projet"
      >
        <Save size={16} />
        <span className="hidden xl:inline">Sauvegarder</span>
      </button>

      <button
        onClick={() => setShowLoadDialog(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
        title="Charger un projet"
      >
        <FolderOpen size={16} />
        <span className="hidden xl:inline">Charger</span>
      </button>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sauvegarder le projet</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Mon email marketing"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                  rows={3}
                  placeholder="Description du projet..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Sauvegarder
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Charger un projet</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-violet-600" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun projet sauvegardé</p>
                <p className="text-sm text-gray-400 mt-2">Créez votre premier projet !</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>{project.sections.length} section(s)</span>
                          <span>•</span>
                          <span>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadProject(project)}
                          className="px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all text-sm"
                        >
                          Charger
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowLoadDialog(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
