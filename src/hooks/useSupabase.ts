import { useState, useEffect } from 'react';
import { SupabaseService, type TemplateData, type ProjectData } from '../services/supabase.service';
import type { GlobalStyleTemplate, EmailProject } from '../types/firebase';

// Convertir les données Supabase vers le format de l'app
function templateFromSupabase(data: TemplateData): GlobalStyleTemplate {
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    backgroundImage: data.background_image || undefined,
    backgroundSize: (data.background_size as 'cover' | 'repeat') || undefined,
    fonts: data.fonts,
    colors: data.colors,
    buttonStyle: data.button_style,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function templateToSupabase(template: Omit<GlobalStyleTemplate, 'id' | 'createdAt' | 'updatedAt'>): Omit<TemplateData, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: template.name,
    description: template.description || null,
    background_image: template.backgroundImage || null,
    background_size: template.backgroundSize || null,
    fonts: template.fonts,
    colors: template.colors,
    button_style: template.buttonStyle,
  };
}

function projectFromSupabase(data: ProjectData): EmailProject {
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    templateId: data.template_id || '',
    sections: data.sections,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function projectToSupabase(project: Omit<EmailProject, 'id' | 'createdAt' | 'updatedAt'>): Omit<ProjectData, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: project.name,
    description: project.description || null,
    template_id: project.templateId || null,
    sections: project.sections,
  };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<GlobalStyleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupabaseService.getTemplates();
      setTemplates(data.map(templateFromSupabase));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des templates');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const createTemplate = async (template: Omit<GlobalStyleTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await SupabaseService.createTemplate(templateToSupabase(template));
      await loadTemplates();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du template');
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Omit<GlobalStyleTemplate, 'id' | 'createdAt'>>) => {
    try {
      const supabaseUpdates: Partial<Omit<TemplateData, 'id' | 'created_at'>> = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description || null;
      if (updates.backgroundImage !== undefined) supabaseUpdates.background_image = updates.backgroundImage || null;
      if (updates.backgroundSize !== undefined) supabaseUpdates.background_size = updates.backgroundSize || null;
      if (updates.fonts !== undefined) supabaseUpdates.fonts = updates.fonts;
      if (updates.colors !== undefined) supabaseUpdates.colors = updates.colors;
      if (updates.buttonStyle !== undefined) supabaseUpdates.button_style = updates.buttonStyle;

      console.log('Mise à jour Supabase:', supabaseUpdates);
      await SupabaseService.updateTemplate(id, supabaseUpdates);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await SupabaseService.deleteTemplate(id);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du template');
      throw err;
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refresh: loadTemplates,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<EmailProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupabaseService.getProjects();
      setProjects(data.map(projectFromSupabase));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des projets');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (project: Omit<EmailProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await SupabaseService.createProject(projectToSupabase(project));
      await loadProjects();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du projet');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Omit<EmailProject, 'id' | 'createdAt'>>) => {
    try {
      const supabaseUpdates: Partial<Omit<ProjectData, 'id' | 'created_at'>> = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description || null;
      if (updates.templateId !== undefined) supabaseUpdates.template_id = updates.templateId || null;
      if (updates.sections !== undefined) supabaseUpdates.sections = updates.sections;

      await SupabaseService.updateProject(id, supabaseUpdates);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du projet');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await SupabaseService.deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du projet');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: loadProjects,
  };
}
