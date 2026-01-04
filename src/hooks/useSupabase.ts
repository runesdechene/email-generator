import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { SupabaseService } from '../services/supabase.service';
import type { TemplateData, ProjectData, SectionTemplateData } from '../services/supabase.service';
import type { GlobalStyleTemplate, EmailProject, SectionTemplate } from '../types/supabase';

// Convertir les données Supabase vers le format de l'app
function templateFromSupabase(data: TemplateData): GlobalStyleTemplate {
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description || undefined,
    backgroundImage: data.background_image || undefined,
    backgroundSize: (data.background_size as 'cover' | 'repeat') || undefined,
    fonts: data.fonts,
    colors: data.colors,
    customColors: data.custom_colors || undefined,
    fontSizes: data.font_sizes,
    paddingInline: data.padding_inline,
    paddingBlock: data.padding_block,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function templateToSupabase(template: Omit<GlobalStyleTemplate, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Omit<TemplateData, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    name: template.name,
    description: template.description || null,
    background_image: template.backgroundImage || null,
    background_size: template.backgroundSize || null,
    fonts: template.fonts,
    colors: template.colors,
    custom_colors: template.customColors || null,
    font_sizes: template.fontSizes,
    padding_inline: template.paddingInline,
    padding_block: template.paddingBlock,
  };
}

function sectionTemplateFromSupabase(data: SectionTemplateData): SectionTemplate {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    thumbnail: data.thumbnail || undefined,
    defaultContent: data.default_content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function sectionTemplateToSupabase(template: Omit<SectionTemplate, 'id' | 'createdAt' | 'updatedAt'>): Omit<SectionTemplateData, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: template.name,
    description: template.description || null,
    thumbnail: template.thumbnail || null,
    default_content: template.defaultContent,
  };
}

function projectFromSupabase(data: ProjectData): EmailProject {
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description || undefined,
    templateId: data.template_id || '',
    sections: data.sections,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function projectToSupabase(project: Omit<EmailProject, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Omit<ProjectData, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
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
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const id = await SupabaseService.createTemplate(templateToSupabase(template, user.id));
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
      if (updates.customColors !== undefined) supabaseUpdates.custom_colors = updates.customColors || null;
      if (updates.fontSizes !== undefined) supabaseUpdates.font_sizes = updates.fontSizes;
      if (updates.paddingInline !== undefined) supabaseUpdates.padding_inline = updates.paddingInline;
      if (updates.paddingBlock !== undefined) supabaseUpdates.padding_block = updates.paddingBlock;

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

export function useSectionTemplates() {
  const [sectionTemplates, setSectionTemplates] = useState<SectionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSectionTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupabaseService.getSectionTemplates();
      setSectionTemplates(data.map(sectionTemplateFromSupabase));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des templates de sections');
      console.error('Error loading section templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectionTemplates();
  }, []);

  const createSectionTemplate = async (template: Omit<SectionTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await SupabaseService.createSectionTemplate(sectionTemplateToSupabase(template));
      await loadSectionTemplates();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du template de section');
      throw err;
    }
  };

  const updateSectionTemplate = async (id: string, updates: Partial<Omit<SectionTemplate, 'id' | 'createdAt'>>) => {
    try {
      const supabaseUpdates: Partial<Omit<SectionTemplateData, 'id' | 'created_at'>> = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description || null;
      if (updates.thumbnail !== undefined) supabaseUpdates.thumbnail = updates.thumbnail || null;
      if (updates.defaultContent !== undefined) supabaseUpdates.default_content = updates.defaultContent;

      await SupabaseService.updateSectionTemplate(id, supabaseUpdates);
      await loadSectionTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du template de section');
      throw err;
    }
  };

  const deleteSectionTemplate = async (id: string) => {
    try {
      await SupabaseService.deleteSectionTemplate(id);
      await loadSectionTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du template de section');
      throw err;
    }
  };

  return {
    sectionTemplates,
    loading,
    error,
    createSectionTemplate,
    updateSectionTemplate,
    deleteSectionTemplate,
    refresh: loadSectionTemplates,
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
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const id = await SupabaseService.createProject(projectToSupabase(project, user.id));
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

