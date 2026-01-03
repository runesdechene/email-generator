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

export interface GlobalStyleTemplate {
  id: string;
  name: string;
  description?: string;
  backgroundImage?: string;
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
  buttonStyle: {
    borderRadius: string;
    backgroundColor: string;
    textColor: string;
    hoverBackgroundColor: string;
    padding: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
