import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';
import { scopeCSS } from '../../utils/scopeCSS';

interface ParagraphSectionProps {
  sectionId: string;
  data: {
    content: string;
  };
  options?: {
    backgroundImageUrl?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    useTemplatePaddingInline?: boolean;
    useTemplatePaddingBlock?: boolean;
    fontFamily?: 'heading' | 'paragraph';
    fontSize?: number | string;
    color?: string;
    textStyle?: {
      align?: 'left' | 'center' | 'right' | 'justify';
      lineHeight?: number;
      letterSpacing?: number;
    };
    customCSS?: string;
  };
}

export function ParagraphSection({ sectionId, data, options = {} }: ParagraphSectionProps) {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();
  
  const paddingTop = options.paddingTop ?? 32;
  const paddingRight = options.paddingRight ?? 32;
  const paddingBottom = options.paddingBottom ?? 32;
  const paddingLeft = options.paddingLeft ?? 32;
  const useTemplatePaddingInline = options.useTemplatePaddingInline ?? false;
  const useTemplatePaddingBlock = options.useTemplatePaddingBlock ?? false;
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

  // Calculer les paddings finaux en fonction des toggles
  const finalPaddingTop = useTemplatePaddingBlock && currentTemplate ? currentTemplate.paddingBlock : paddingTop;
  const finalPaddingBottom = useTemplatePaddingBlock && currentTemplate ? currentTemplate.paddingBlock : paddingBottom;
  const finalPaddingLeft = useTemplatePaddingInline && currentTemplate ? currentTemplate.paddingInline : paddingLeft;
  const finalPaddingRight = useTemplatePaddingInline && currentTemplate ? currentTemplate.paddingInline : paddingRight;

  // Styles de base
  const baseStyle: React.CSSProperties = {
    paddingTop: `${finalPaddingTop}px`,
    paddingRight: `${finalPaddingRight}px`,
    paddingBottom: `${finalPaddingBottom}px`,
    paddingLeft: `${finalPaddingLeft}px`,
    backgroundColor: 'transparent',
    textAlign,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    fontFamily: fontFamilyValue ? `'${fontFamilyValue}', sans-serif` : undefined,
    fontSize: `${fontSize}px`,
    color: color || '#000000',
    ...(options.backgroundImageUrl && {
      backgroundImage: `url(${options.backgroundImageUrl})`,
      backgroundSize: options.backgroundSize || 'cover',
      backgroundPosition: options.backgroundPosition || 'center',
      backgroundRepeat: options.backgroundRepeat || 'no-repeat',
    }),
  };

  // Scoper le CSS personnalisé à cette section uniquement
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

  return (
    <>
      {scopedCSS && (
        <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
      )}
      <div
        className="section-texte"
        data-section-id={sectionId}
        style={baseStyle}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </>
  );
}
