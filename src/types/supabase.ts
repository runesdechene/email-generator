export interface EmailProject {
  id: string;
  user_id: string;
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

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  defaultContent: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalStyleTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'repeat';
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
  customColors?: Array<{
    name: string;
    value: string;
  }>;
  fontSizes: {
    xxl: number;
    xl: number;
    l: number;
    m: number;
    s: number;
    xs: number;
  };
  tagFontSizes?: {
    p: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
  };
  paddingInline: number;
  paddingBlock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionPreset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  sectionType: string;
  content: Record<string, unknown>;
  templateIds: string[]; // IDs des templates auxquels ce preset est lié
  createdAt: Date;
  updatedAt: Date;
}
