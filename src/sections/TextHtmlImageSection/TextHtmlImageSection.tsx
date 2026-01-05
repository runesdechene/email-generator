import { useTemplates } from '../../hooks/useSupabase';
import { useEmailStore } from '../../store/emailStore';
import { scopeCSS } from '../../utils/scopeCSS';

interface TextHtmlImageSectionProps {
  sectionId: string;
  content: string;
  options: {
    imageUrl?: string;
    imagePosition?: 'left' | 'right';
    imageWidth?: number;
    clipPath?: string;
    backgroundEnabled?: boolean;
    backgroundType?: 'color' | 'gradient' | 'image';
    backgroundColor?: string;
    gradientStart?: string;
    gradientEnd?: string;
    gradientDirection?: string;
    backgroundImageUrl?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundClipPath?: string;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    useTemplatePaddingInline?: boolean;
    useTemplatePaddingBlock?: boolean;
    tagFontSizes?: {
      p?: number;
      h1?: number;
      h2?: number;
      h3?: number;
      h4?: number;
      h5?: number;
    };
    tagColors?: {
      p?: string;
      h1?: string;
      h2?: string;
      h3?: string;
      h4?: string;
      h5?: string;
    };
    textStyle?: {
      align?: 'left' | 'center' | 'right';
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      lineHeight?: number;
      letterSpacing?: number;
    };
    customCSS?: string;
  };
}

export function TextHtmlImageSection({ sectionId, content, options }: TextHtmlImageSectionProps) {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();
  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  const {
    imageUrl,
    imagePosition = 'right',
    imageWidth = 50,
    clipPath = 'none',
    backgroundEnabled = false,
    backgroundType = 'color',
    backgroundColor = '#ffffff',
    gradientStart = '#667eea',
    gradientEnd = '#764ba2',
    gradientDirection = 'to bottom',
    backgroundImageUrl,
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    backgroundRepeat = 'no-repeat',
    backgroundClipPath = 'none',
    paddingTop = 40,
    paddingBottom = 40,
    paddingLeft = 40,
    paddingRight = 40,
    useTemplatePaddingInline = false,
    useTemplatePaddingBlock = false,
    tagFontSizes,
    tagColors,
    textStyle = {},
    customCSS = '',
  } = options;

  const finalPaddingTop = useTemplatePaddingBlock ? currentTemplate?.paddingBlock ?? 40 : paddingTop;
  const finalPaddingBottom = useTemplatePaddingBlock ? currentTemplate?.paddingBlock ?? 40 : paddingBottom;
  const finalPaddingLeft = useTemplatePaddingInline ? currentTemplate?.paddingInline ?? 40 : paddingLeft;
  const finalPaddingRight = useTemplatePaddingInline ? currentTemplate?.paddingInline ?? 40 : paddingRight;

  const {
    align = 'left',
    bold = false,
    italic = false,
    underline = false,
    lineHeight = 1.5,
    letterSpacing = 0,
  } = textStyle;

  // CSS personnalisé scopé
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

  // CSS pour les tailles personnalisées par balise
  const tagFontSizesCSS = tagFontSizes ? `
    ${tagFontSizes.p ? `[data-section-id="${sectionId}"] p { font-size: ${tagFontSizes.p}px !important; }` : ''}
    ${tagFontSizes.h1 ? `[data-section-id="${sectionId}"] h1 { font-size: ${tagFontSizes.h1}px !important; }` : ''}
    ${tagFontSizes.h2 ? `[data-section-id="${sectionId}"] h2 { font-size: ${tagFontSizes.h2}px !important; }` : ''}
    ${tagFontSizes.h3 ? `[data-section-id="${sectionId}"] h3 { font-size: ${tagFontSizes.h3}px !important; }` : ''}
    ${tagFontSizes.h4 ? `[data-section-id="${sectionId}"] h4 { font-size: ${tagFontSizes.h4}px !important; }` : ''}
    ${tagFontSizes.h5 ? `[data-section-id="${sectionId}"] h5 { font-size: ${tagFontSizes.h5}px !important; }` : ''}
  ` : '';

  // CSS pour les couleurs personnalisées par balise
  const tagColorsCSS = tagColors ? `
    ${tagColors.p ? `[data-section-id="${sectionId}"] p { color: ${tagColors.p} !important; }` : ''}
    ${tagColors.h1 ? `[data-section-id="${sectionId}"] h1 { color: ${tagColors.h1} !important; }` : ''}
    ${tagColors.h2 ? `[data-section-id="${sectionId}"] h2 { color: ${tagColors.h2} !important; }` : ''}
    ${tagColors.h3 ? `[data-section-id="${sectionId}"] h3 { color: ${tagColors.h3} !important; }` : ''}
    ${tagColors.h4 ? `[data-section-id="${sectionId}"] h4 { color: ${tagColors.h4} !important; }` : ''}
    ${tagColors.h5 ? `[data-section-id="${sectionId}"] h5 { color: ${tagColors.h5} !important; }` : ''}
  ` : '';

  // Générer le style de fond selon le type (seulement si backgroundEnabled est true)
  let backgroundStyle: React.CSSProperties = {};
  
  if (backgroundEnabled) {
    if (backgroundType === 'color') {
      backgroundStyle = {
        backgroundColor,
      };
    } else if (backgroundType === 'gradient') {
      const gradientCSS = gradientDirection === 'radial'
        ? `radial-gradient(circle, ${gradientStart}, ${gradientEnd})`
        : `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
      backgroundStyle = {
        background: gradientCSS,
      };
    } else if (backgroundType === 'image' && backgroundImageUrl) {
      backgroundStyle = {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
      };
    }
  }

  const containerStyle: React.CSSProperties = {
    paddingTop: `${finalPaddingTop}px`,
    paddingBottom: `${finalPaddingBottom}px`,
    paddingLeft: `${finalPaddingLeft}px`,
    paddingRight: `${finalPaddingRight}px`,
    position: 'relative',
    ...backgroundStyle,
    ...(backgroundClipPath !== 'none' && {
      clipPath: backgroundClipPath,
    }),
  };

  const contentTextStyle: React.CSSProperties = {
    textAlign: align,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
  };

  const contentWidth = imageUrl ? `${100 - imageWidth}%` : '100%';
  const imageWidthPercent = `${imageWidth}%`;

  if (!imageUrl) {
    return (
      <>
        {scopedCSS && <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />}
        {tagFontSizesCSS && <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />}
        {tagColorsCSS && <style dangerouslySetInnerHTML={{ __html: tagColorsCSS }} />}
        <div
          className="section-text-html-image section-container"
          data-section-id={sectionId}
          style={containerStyle}
        >
          <div
            style={contentTextStyle}
            dangerouslySetInnerHTML={{ __html: content || '<p>Votre contenu HTML ici...</p>' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {scopedCSS && <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />}
      {tagFontSizesCSS && <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />}
      {tagColorsCSS && <style dangerouslySetInnerHTML={{ __html: tagColorsCSS }} />}
      <div
        className="section-text-html-image section-container"
        data-section-id={sectionId}
        style={containerStyle}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexDirection: imagePosition === 'left' ? 'row-reverse' : 'row' }}>
          <div style={{ width: contentWidth, ...contentTextStyle }}>
            <div dangerouslySetInnerHTML={{ __html: content || '<p>Votre contenu HTML ici...</p>' }} />
          </div>
          <div style={{ width: imageWidthPercent, flexShrink: 0 }}>
            <img
              src={imageUrl}
              alt="Section"
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                clipPath: clipPath !== 'none' ? clipPath : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
