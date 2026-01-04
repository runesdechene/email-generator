import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { SupabaseService } from '../services/supabase.service';
import type { SectionPresetData } from '../services/supabase.service';
import type { SectionPreset } from '../types/supabase';

// Conversion des données Supabase vers le format de l'application
function presetFromSupabase(data: SectionPresetData, templateIds: string[]): SectionPreset {
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description || undefined,
    sectionType: data.section_type,
    content: data.content,
    templateIds,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Conversion du format de l'application vers Supabase
function presetToSupabase(preset: Omit<SectionPreset, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Omit<SectionPresetData, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    name: preset.name,
    description: preset.description || null,
    section_type: preset.sectionType,
    content: preset.content,
  };
}

export function usePresets() {
  const [presets, setPresets] = useState<SectionPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupabaseService.getSectionPresets();
      
      // Charger les templateIds pour chaque preset
      const presetsWithTemplates = await Promise.all(
        data.map(async (presetData) => {
          const templateIds = await SupabaseService.getPresetTemplateIds(presetData.id);
          return presetFromSupabase(presetData, templateIds);
        })
      );
      
      setPresets(presetsWithTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des presets');
      console.error('Error loading presets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPresetsByTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupabaseService.getPresetsByTemplate(templateId);
      
      // Charger les templateIds pour chaque preset
      const presetsWithTemplates = await Promise.all(
        data.map(async (presetData) => {
          const templateIds = await SupabaseService.getPresetTemplateIds(presetData.id);
          return presetFromSupabase(presetData, templateIds);
        })
      );
      
      setPresets(presetsWithTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des presets');
      console.error('Error loading presets by template:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPreset = async (preset: Omit<SectionPreset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const id = await SupabaseService.createSectionPreset(
        presetToSupabase(preset, user.id),
        preset.templateIds
      );
      await loadPresets();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du preset');
      throw err;
    }
  };

  const updatePreset = async (id: string, updates: Partial<Omit<SectionPreset, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>>) => {
    try {
      const supabaseUpdates: Partial<Omit<SectionPresetData, 'id' | 'created_at' | 'user_id'>> = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description || null;
      if (updates.sectionType !== undefined) supabaseUpdates.section_type = updates.sectionType;
      if (updates.content !== undefined) supabaseUpdates.content = updates.content;

      await SupabaseService.updateSectionPreset(id, supabaseUpdates, updates.templateIds);
      await loadPresets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du preset');
      throw err;
    }
  };

  const deletePreset = async (id: string) => {
    try {
      await SupabaseService.deleteSectionPreset(id);
      await loadPresets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du preset');
      throw err;
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  return {
    presets,
    loading,
    error,
    loadPresets,
    loadPresetsByTemplate,
    createPreset,
    updatePreset,
    deletePreset,
  };
}
