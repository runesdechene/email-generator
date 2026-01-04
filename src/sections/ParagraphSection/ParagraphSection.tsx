import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';

interface ParagraphSectionProps {
  data: {
    content: string;
  };
  options?: {
    padding?: number;
    fontFamily?: 'heading' | 'paragraph';
    textStyle?: {
      align?: 'left' | 'center' | 'right' | 'justify';
      lineHeight?: number;
      letterSpacing?: number;
    };
    customCSS?: string;
  };
}

export function ParagraphSection({ data, options = {} }: ParagraphSectionProps) {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();
  
  const padding = options.padding ?? 32;
  const fontFamily = options.fontFamily ?? 'paragraph';
  const textAlign = options.textStyle?.align ?? 'left';
  const lineHeight = options.textStyle?.lineHeight ?? 1.6;
  const letterSpacing = options.textStyle?.letterSpacing ?? 0;
  const customCSS = options.customCSS ?? '';

  // Récupérer le template actuel pour obtenir les polices
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  const fontFamilyValue = fontFamily === 'heading' 
    ? currentTemplate?.fonts.title 
    : currentTemplate?.fonts.paragraph;

  // Styles de base
  const baseStyle: React.CSSProperties = {
    padding: `${padding}px`,
    backgroundColor: 'transparent',
    textAlign,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    fontFamily: fontFamilyValue ? `'${fontFamilyValue}', sans-serif` : undefined,
  };

  // Parser le CSS personnalisé
  let parsedCustomStyle: React.CSSProperties = {};
  if (customCSS) {
    try {
      const cssProperties = customCSS.split(';').filter(prop => prop.trim());
      cssProperties.forEach(prop => {
        const [key, value] = prop.split(':').map(s => s.trim());
        if (key && value) {
          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          (parsedCustomStyle as any)[camelKey] = value;
        }
      });
    } catch (error) {
      console.error('Erreur lors du parsing du CSS personnalisé:', error);
    }
  }

  return (
    <div
      className="section-texte"
      style={{
        ...baseStyle,
        ...parsedCustomStyle,
      }}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  );
}
