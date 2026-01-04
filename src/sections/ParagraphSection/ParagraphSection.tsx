import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';

interface ParagraphSectionProps {
  data: {
    content: string;
  };
  options?: {
    padding?: number;
    fontFamily?: 'heading' | 'paragraph';
    fontSize?: number;
    color?: string;
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
  const fontSizeOption = options.fontSize ?? 16;
  const colorOption = options.color ?? '#000000';
  const textAlign = options.textStyle?.align ?? 'left';
  const lineHeight = options.textStyle?.lineHeight ?? 1.6;
  const letterSpacing = options.textStyle?.letterSpacing ?? 0;
  const customCSS = options.customCSS ?? '';

  // Récupérer le template actuel pour obtenir les polices, couleurs et tailles
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  const fontFamilyValue = fontFamily === 'heading' 
    ? currentTemplate?.fonts.title 
    : currentTemplate?.fonts.paragraph;
  
  // Résoudre la taille de police : si c'est une variable du template (ex: 'xxl'), utiliser la taille du template
  const fontSizeKeys = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
  const fontSize = typeof fontSizeOption === 'string' && fontSizeKeys.includes(fontSizeOption) && currentTemplate
    ? currentTemplate.fontSizes[fontSizeOption as keyof typeof currentTemplate.fontSizes]
    : typeof fontSizeOption === 'number'
    ? fontSizeOption
    : 16;
  
  // Résoudre la couleur : si c'est une variable du template (ex: 'primary' ou nom de couleur personnalisée), utiliser la couleur du template
  const templateColorKeys = ['primary', 'secondary', 'background', 'text', 'accent'];
  let color = colorOption;
  
  if (currentTemplate) {
    // Vérifier si c'est une couleur principale
    if (templateColorKeys.includes(colorOption)) {
      color = currentTemplate.colors[colorOption as keyof typeof currentTemplate.colors];
    }
    // Vérifier si c'est une couleur personnalisée
    else if (currentTemplate.customColors) {
      const customColor = currentTemplate.customColors.find(c => c.name === colorOption);
      if (customColor) {
        color = customColor.value;
      }
    }
  }

  // Styles de base
  const baseStyle: React.CSSProperties = {
    padding: `${padding}px`,
    backgroundColor: 'transparent',
    textAlign,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    fontFamily: fontFamilyValue ? `'${fontFamilyValue}', sans-serif` : undefined,
    fontSize: `${fontSize}px`,
    color: color || '#000000',
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
