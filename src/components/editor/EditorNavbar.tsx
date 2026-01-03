import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useProjects, useTemplates } from '../../hooks/useSupabase';
import { useEmailStore } from '../../store/emailStore';
import type { EmailProject } from '../../types/firebase';

export function EditorNavbar() {
  const { projects, loading: projectsLoading } = useProjects();
  const { templates } = useTemplates();
  const { currentProjectId, setCurrentTemplate, reorderSections, setCurrentProject: setStoreProjectId } = useEmailStore();
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const currentProject = projects.find(p => p.id === currentProjectId) || null;

  const handleSelectProject = (project: EmailProject) => {
    setStoreProjectId(project.id);
    setCurrentTemplate(project.templateId);
    reorderSections(project.sections);
    setShowProjectSelector(false);
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Sans template';
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-center px-6 relative z-30">
      <div className="relative">
        <button
          onClick={() => setShowProjectSelector(!showProjectSelector)}
          className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all min-w-[300px]"
        >
          <div className="flex-1 text-left">
            {currentProject ? (
              <>
                <p className="text-sm font-medium text-gray-900">{currentProject.name}</p>
                <p className="text-xs text-gray-500">Template: {getTemplateName(currentProject.templateId)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Sélectionner un projet</p>
            )}
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${showProjectSelector ? 'rotate-180' : ''}`} />
        </button>

        {showProjectSelector && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowProjectSelector(false)}
            />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-20">
              {projectsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-violet-600" />
                </div>
              ) : projects.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">Aucun projet sauvegardé</p>
                  <p className="text-xs text-gray-400 mt-1">Créez votre premier projet !</p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Projets récents</p>
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className={`w-full px-4 py-3 text-left hover:bg-violet-50 transition-all border-l-2 ${
                        currentProject?.id === project.id
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700">
                              {getTemplateName(project.templateId)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {project.sections.length} section(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
