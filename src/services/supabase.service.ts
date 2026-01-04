import { supabase } from '../config/supabase';

export interface TemplateData {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  background_image: string | null;
  background_size: string | null;
  fonts: {
    title: string;
    paragraph: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  custom_colors: Array<{
    name: string;
    value: string;
  }> | null;
  font_sizes: {
    xxl: number;
    xl: number;
    l: number;
    m: number;
    s: number;
    xs: number;
  };
  padding_inline: number;
  padding_block: number;
  created_at: string;
  updated_at: string;
}

export interface SectionTemplateData {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  default_content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SectionPresetData {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  section_type: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectData {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  template_id: string | null;
  sections: Array<{
    id: string;
    templateId: string;
    name: string;
    content: Record<string, unknown>;
    order: number;
  }>;
  created_at: string;
  updated_at: string;
}

export class SupabaseService {
  // ============ TEMPLATES ============

  static async getTemplates(): Promise<TemplateData[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createTemplate(template: Omit<TemplateData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('templates')
      .insert(template)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async updateTemplate(id: string, updates: Partial<Omit<TemplateData, 'id' | 'created_at'>>): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ SECTION TEMPLATES ============

  static async getSectionTemplates(): Promise<SectionTemplateData[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createSectionTemplate(template: Omit<SectionTemplateData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('sections')
      .insert(template)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async updateSectionTemplate(id: string, updates: Partial<Omit<SectionTemplateData, 'id' | 'created_at'>>): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteSectionTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ PROJECTS ============

  static async getProjects(): Promise<ProjectData[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createProject(project: Omit<ProjectData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async updateProject(id: string, updates: Partial<Omit<ProjectData, 'id' | 'created_at'>>): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ============ SECTION PRESETS ============

  static async getSectionPresets(): Promise<SectionPresetData[]> {
    const { data, error } = await supabase
      .from('section_presets')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getPresetsByTemplate(templateId: string): Promise<SectionPresetData[]> {
    const { data, error } = await supabase
      .from('section_presets')
      .select(`
        *,
        preset_templates!inner(template_id)
      `)
      .eq('preset_templates.template_id', templateId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createSectionPreset(
    preset: Omit<SectionPresetData, 'id' | 'created_at' | 'updated_at'>,
    templateIds: string[]
  ): Promise<string> {
    // 1. Créer le preset
    const { data: presetData, error: presetError } = await supabase
      .from('section_presets')
      .insert(preset)
      .select('id')
      .single();

    if (presetError) throw presetError;

    // 2. Créer les liaisons avec les templates
    if (templateIds.length > 0) {
      const links = templateIds.map(templateId => ({
        preset_id: presetData.id,
        template_id: templateId
      }));

      const { error: linksError } = await supabase
        .from('preset_templates')
        .insert(links);

      if (linksError) throw linksError;
    }

    return presetData.id;
  }

  static async updateSectionPreset(
    id: string,
    updates: Partial<Omit<SectionPresetData, 'id' | 'created_at' | 'user_id'>>,
    templateIds?: string[]
  ): Promise<void> {
    // 1. Mettre à jour le preset
    const { error: updateError } = await supabase
      .from('section_presets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    // 2. Si templateIds est fourni, mettre à jour les liaisons
    if (templateIds !== undefined) {
      // Supprimer les anciennes liaisons
      const { error: deleteError } = await supabase
        .from('preset_templates')
        .delete()
        .eq('preset_id', id);

      if (deleteError) throw deleteError;

      // Créer les nouvelles liaisons
      if (templateIds.length > 0) {
        const links = templateIds.map(templateId => ({
          preset_id: id,
          template_id: templateId
        }));

        const { error: insertError } = await supabase
          .from('preset_templates')
          .insert(links);

        if (insertError) throw insertError;
      }
    }
  }

  static async deleteSectionPreset(id: string): Promise<void> {
    const { error } = await supabase
      .from('section_presets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getPresetTemplateIds(presetId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('preset_templates')
      .select('template_id')
      .eq('preset_id', presetId);

    if (error) throw error;
    return data?.map(d => d.template_id) || [];
  }
}
