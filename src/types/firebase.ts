export interface EmailProject {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  sections: Array<{
    id: string;
    templateId: string;
    name: string;
    content: Record<string, unknown>;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionTemplateData {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'text' | 'image' | 'cta' | 'product' | 'footer' | 'custom';
  thumbnail?: string;
  defaultContent: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
