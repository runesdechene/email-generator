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
      .from('section_templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createSectionTemplate(template: Omit<SectionTemplateData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('section_templates')
      .insert(template)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async updateSectionTemplate(id: string, updates: Partial<Omit<SectionTemplateData, 'id' | 'created_at'>>): Promise<void> {
    const { error } = await supabase
      .from('section_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteSectionTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('section_templates')
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
}
