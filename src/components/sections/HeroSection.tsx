import { useTemplates } from '../../hooks/useSupabase';
import { scopeCSS } from '../../utils/scopeCSS';
import type { EmailSection } from '../../types';

interface HeroSectionProps {
  section: EmailSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  const { templates } = useTemplates();
  const options = (section.content.options as any) || {};
  const content = (section.content.content as string) || '';
  const sectionId = section.id;

  // Récupérer le template actuel
  const currentTemplate = templates.find(t => t.id === section.templateId);

  // Gérer l'image de fond
  const backgroundImageUrl = options.backgroundImageUrl || '';
  const backgroundSize = options.backgroundSize || 'cover';
  const backgroundPosition = options.backgroundPosition || 'center';
  const backgroundRepeat = options.backgroundRepeat || 'no-repeat';

  // Gérer les paddings
  const paddingTop = options.useTemplatePaddingBlock 
    ? currentTemplate?.paddingBlock ?? 32 
    : options.paddingTop ?? 32;
  const paddingBottom = options.useTemplatePaddingBlock 
    ? currentTemplate?.paddingBlock ?? 32 
    : options.paddingBottom ?? 32;
  const paddingLeft = options.useTemplatePaddingInline 
    ? currentTemplate?.paddingInline ?? 32 
    : options.paddingLeft ?? 32;
  const paddingRight = options.useTemplatePaddingInline 
    ? currentTemplate?.paddingInline ?? 32 
    : options.paddingRight ?? 32;

  // Gérer la police
  const fontFamily = options.font === 'title' 
    ? currentTemplate?.fonts.title 
    : options.font === 'paragraph' 
    ? currentTemplate?.fonts.paragraph 
    : undefined;

  // Gérer la taille de police
  let fontSize: number;
  if (typeof options.fontSize === 'string') {
    const sizeMap = currentTemplate?.fontSizes || { xxl: 48, xl: 36, l: 24, m: 16, s: 14, xs: 12 };
    fontSize = sizeMap[options.fontSize as keyof typeof sizeMap] || 16;
  } else {
    fontSize = options.fontSize ?? 16;
  }

  // Gérer la couleur
  let color: string;
  if (options.color && currentTemplate) {
    const colorMap: Record<string, string> = {
      primary: currentTemplate.colors.primary,
      secondary: currentTemplate.colors.secondary,
      background: currentTemplate.colors.background,
      text: currentTemplate.colors.text,
      accent: currentTemplate.colors.accent,
    };
    
    // Vérifier les couleurs personnalisées
    const customColor = currentTemplate.customColors?.find(c => c.name === options.color);
    if (customColor) {
      color = customColor.value;
    } else {
      color = colorMap[options.color] || options.color;
    }
  } else {
    color = options.color || '#000000';
  }

  // Style du texte
  const textStyle = options.textStyle || {};
  const textAlign = textStyle.align || 'left';
  const fontWeight = textStyle.bold ? 'bold' : 'normal';
  const fontStyle = textStyle.italic ? 'italic' : 'normal';
  const textDecoration = textStyle.underline ? 'underline' : 'none';
  const lineHeight = textStyle.lineHeight || 1.5;

  // CSS personnalisé scopé à cette section uniquement
  const customCSS = options.customCSS || '';
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

  const style: React.CSSProperties = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    fontFamily,
    fontSize: `${fontSize}px`,
    color,
    textAlign: textAlign as any,
    fontWeight,
    fontStyle,
    textDecoration,
    lineHeight,
    position: 'relative',
    ...(backgroundImageUrl && {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize,
      backgroundPosition,
      backgroundRepeat,
    }),
  };

  // Si une image est présente, utiliser un layout avec image
  if (options.imageUrl) {
    // Gérer la taille de l'image (pourcentage de 0 à 100)
    const imageSize = typeof options.imageSize === 'number' ? options.imageSize : 80;
    const maxWidth = `${imageSize}%`;

    return (
      <>
        {scopedCSS && (
          <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
        )}
        <div style={style} data-section-id={sectionId}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '24px'
          }}>
            <img 
              src={options.imageUrl} 
              alt="Hero" 
              style={{ 
                maxWidth, 
                width: '100%',
                height: 'auto',
                borderRadius: '8px'
              }} 
            />
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </>
    );
  }

  // Sans image, juste le contenu
  return (
    <>
      {scopedCSS && (
        <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
      )}
      <div 
        style={style}
        data-section-id={sectionId}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
