export interface EmailSection {
  id: string;
  templateId: string;
  name: string;
  content: Record<string, unknown>;
  order: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
}

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  defaultContent: Record<string, unknown>;
}

export interface GlobalStyle {
  id: string;
  name: string;
  fonts: {
    title: string;
    paragraph: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  buttonStyle: {
    borderRadius: string;
    backgroundColor: string;
    textColor: string;
  };
}
