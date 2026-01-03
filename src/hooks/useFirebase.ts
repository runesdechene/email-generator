import { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebase.service';
import type { EmailProject, SectionTemplateData } from '../types/firebase';

export function useProjects() {
  const [projects, setProjects] = useState<EmailProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirebaseService.getProjects();
      setProjects(data);
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
      const id = await FirebaseService.createProject(project);
      await loadProjects();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du projet');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Omit<EmailProject, 'id' | 'createdAt'>>) => {
    try {
      await FirebaseService.updateProject(id, updates);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du projet');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await FirebaseService.deleteProject(id);
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

export function useTemplates() {
  const [templates, setTemplates] = useState<SectionTemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirebaseService.getTemplates();
      setTemplates(data);
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

  const createTemplate = async (template: Omit<SectionTemplateData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createTemplate(template);
      await loadTemplates();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du template');
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Omit<SectionTemplateData, 'id' | 'createdAt'>>) => {
    try {
      await FirebaseService.updateTemplate(id, updates);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await FirebaseService.deleteTemplate(id);
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
