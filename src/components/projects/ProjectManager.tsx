import { useState } from 'react';
import { Save, FolderOpen, Loader2, Trash2, Pencil } from 'lucide-react';
import { useProjects } from '../../hooks/useSupabase';
import { useEmailStore } from '../../store/emailStore';
import type { EmailProject } from '../../types/supabase';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function ProjectManager() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { sections, currentTemplateId, currentProjectId, setCurrentProject } = useEmailStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({ show: false, title: '', message: '', onConfirm: () => {} });
  const toast = useToast();

  const handleSaveProject = async () => {
    const currentProject = projects.find(p => p.id === currentProjectId);

    if (currentProject) {
      try {
        setSaving(true);
        await updateProject(currentProject.id, {
          templateId: currentTemplateId || currentProject.templateId,
          sections: sections.map(s => ({
            id: s.id,
            templateId: s.templateId,
            name: s.name,
            content: s.content,
            order: s.order,
          })),
        });
        toast.success('Projet mis à jour avec succès !');
      } catch (error) {
        console.error('Error updating project:', error);
        toast.error('Erreur lors de la mise à jour du projet');
      } finally {
        setSaving(false);
      }
    } else {
      if (!projectName.trim()) {
        toast.error('Veuillez entrer un nom de projet');
        return;
      }

      try {
        setSaving(true);
        const newProjectId = await createProject({
          name: projectName,
          description: projectDescription,
          templateId: currentTemplateId || '',
          sections: sections.map(s => ({
            id: s.id,
            templateId: s.templateId,
            name: s.name,
            content: s.content,
            order: s.order,
          })),
        });
        
        // Charger automatiquement le projet créé
        setCurrentProject(newProjectId);
        
        setShowSaveDialog(false);
        setProjectName('');
        setProjectDescription('');
        toast.success('Projet créé et chargé avec succès !');
      } catch (error) {
        console.error('Error saving project:', error);
        toast.error('Erreur lors de la sauvegarde du projet');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleLoadProject = (project: EmailProject) => {
    console.log('🔄 Chargement du projet:', project);
    
    if (sections.length > 0 && currentProjectId !== project.id) {
      setConfirmDialog({
        show: true,
        title: 'Charger ce projet ?',
        message: 'Charger ce projet remplacera votre travail actuel. Voulez-vous continuer ?',
        variant: 'warning',
        onConfirm: () => {
          setConfirmDialog({ ...confirmDialog, show: false });
          loadProject(project);
        },
      });
      return;
    }
    
    loadProject(project);
  };

  const loadProject = (project: EmailProject) => {

    try {
      // Récupérer les fonctions du store
      const { setCurrentTemplate, reorderSections } = useEmailStore.getState();
      
      console.log('📋 Sections à charger:', project.sections);
      console.log('🎨 Template ID:', project.templateId);
      
      // Charger le projet
      setCurrentProject(project.id);
      setCurrentTemplate(project.templateId);
      reorderSections(project.sections);
      
      console.log('✅ Projet chargé dans le store');
      
      // Fermer la modal
      setShowLoadDialog(false);
      
      toast.success('Projet chargé avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement du projet');
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    setConfirmDialog({
      show: true,
      title: 'Supprimer le projet ?',
      message: `Êtes-vous sûr de vouloir supprimer le projet "${name}" ? Cette action est irréversible.`,
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, show: false });
        try {
          await deleteProject(id);
          toast.success('Projet supprimé avec succès !');
        } catch (error) {
          console.error('Error deleting project:', error);
          toast.error('Erreur lors de la suppression du projet');
        }
      },
    });
  };

  const handleEditProjectName = async () => {
    if (!editingProjectName.trim()) {
      toast.error('Veuillez entrer un nom de projet');
      return;
    }

    if (!currentProjectId) {
      return;
    }

    try {
      setSaving(true);
      await updateProject(currentProjectId, {
        name: editingProjectName,
      });
      setShowEditDialog(false);
      setEditingProjectName('');
      toast.success('Nom du projet mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating project name:', error);
      toast.error('Erreur lors de la mise à jour du nom du projet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="flex gap-2">
      <button
        onClick={() => {
          const currentProject = projects.find(p => p.id === currentProjectId);
          if (currentProject) {
            handleSaveProject();
          } else {
            setShowSaveDialog(true);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all text-sm font-medium"
        title={currentProjectId ? "Sauvegarder les modifications" : "Créer un nouveau projet"}
      >
        {currentProjectId ? (
          <>
            <Save size={16} />
            Sauvegarder
          </>
        ) : (
          <>
            <Save size={16} />
            + Nouveau projet
          </>
        )}
      </button>

      <button
        onClick={() => setShowLoadDialog(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
        title="Charger un projet"
      >
        <FolderOpen size={16} />
        <span className="hidden xl:inline">Charger</span>
      </button>

  </div>
  {currentProjectId && (
    <div>
      <div className="ml-2 flex items-center gap-2 pt-5">
        <span className="text-lg font-semibold text-gray-900">
          {projects.find(p => p.id === currentProjectId)?.name || ''}
        </span>
        <button
          onClick={() => {
            const currentProject = projects.find(p => p.id === currentProjectId);
            if (currentProject) {
              setEditingProjectName(currentProject.name);
              setShowEditDialog(true);
            }
          }}
          className="p-1.5 text-gray-400 hover:text-violet-600 transition-all rounded-lg hover:bg-violet-50"
          title="Modifier le nom du projet"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  )}
      {showEditDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowEditDialog(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Modifier le nom du projet</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={editingProjectName}
                  onChange={(e) => setEditingProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Mon email marketing"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditProjectName}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Enregistrer
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEditDialog(false)}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSaveDialog(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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

      <ToastContainer toasts={toast.toasts} onClose={toast.closeToast} />
      
      {confirmDialog.show && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant={confirmDialog.variant}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
        />
      )}
  </>
  );
  
}

