import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';
import { scopeCSS } from '../../utils/scopeCSS';
import { generateDividerSVG } from '../../utils/dividerSVG';
import { generateBackgroundBlur } from '../../utils/overlayStyle';

interface ParagraphSectionProps {
  sectionId: string;
  data: {
    content: string;
  };
  options?: {
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
    overlay?: {
      enabled?: boolean;
      type?: 'color' | 'gradient';
      color?: string;
      gradientStart?: string;
      gradientEnd?: string;
      gradientDirection?: 'to-bottom' | 'to-top' | 'to-right' | 'to-left' | 'to-bottom-right' | 'to-bottom-left';
      opacity?: number;
      blur?: number;
    };
    topDividerEnabled?: boolean;
    topDividerType?: 'image' | 'svg';
    topDividerImageUrl?: string;
    topDividerSvgType?: 'wave' | 'slant';
    topDividerColor?: string;
    topDividerHeight?: number;
    topDividerFlip?: boolean;
    bottomDividerEnabled?: boolean;
    bottomDividerType?: 'image' | 'svg';
    bottomDividerImageUrl?: string;
    bottomDividerSvgType?: 'wave' | 'slant';
    bottomDividerColor?: string;
    bottomDividerHeight?: number;
    bottomDividerFlip?: boolean;
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
  const tagFontSizes = options.tagFontSizes;
  const tagColors = options.tagColors;
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

  // Générer le filtre blur si activé
  const blurValue = options.overlay?.blur || 0;
  const blurFilter = generateBackgroundBlur(blurValue);

  // Générer le style de fond selon le type (seulement si backgroundEnabled est true)
  let backgroundStyleBase: React.CSSProperties = {};
  const backgroundEnabled = options.backgroundEnabled || false;
  const backgroundType = options.backgroundType || 'color';
  
  if (backgroundEnabled) {
    if (backgroundType === 'color') {
      backgroundStyleBase = {
        backgroundColor: options.backgroundColor || '#ffffff',
      };
    } else if (backgroundType === 'gradient') {
      const gradientDir = options.gradientDirection || 'to bottom';
      const gradientCSS = gradientDir === 'radial'
        ? `radial-gradient(circle, ${options.gradientStart || '#667eea'}, ${options.gradientEnd || '#764ba2'})`
        : `linear-gradient(${gradientDir}, ${options.gradientStart || '#667eea'}, ${options.gradientEnd || '#764ba2'})`;
      backgroundStyleBase = {
        background: gradientCSS,
      };
    } else if (backgroundType === 'image' && options.backgroundImageUrl && blurValue === 0) {
      backgroundStyleBase = {
        backgroundImage: `url(${options.backgroundImageUrl})`,
        backgroundSize: options.backgroundSize || 'cover',
        backgroundPosition: options.backgroundPosition || 'center',
        backgroundRepeat: options.backgroundRepeat || 'no-repeat',
      };
    }
  }

  // Styles de base
  const baseStyle: React.CSSProperties = {
    paddingTop: `${finalPaddingTop}px`,
    paddingRight: `${finalPaddingRight}px`,
    paddingBottom: `${finalPaddingBottom}px`,
    paddingLeft: `${finalPaddingLeft}px`,
    textAlign,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    color: color || '#000000',
    ...backgroundStyleBase,
    ...(options.backgroundClipPath && options.backgroundClipPath !== 'none' && {
      clipPath: options.backgroundClipPath,
    }),
  };

  // Ajouter le style pour l'image de fond avec blur
  const containerStyle: React.CSSProperties = {
    ...baseStyle,
    position: 'relative',
    overflow: 'hidden',
  };

  // Style pour un élément qui contiendra l'image de fond avec blur
  const backgroundStyle: React.CSSProperties | undefined = backgroundType === 'image' && options.backgroundImageUrl && blurValue > 0 ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${options.backgroundImageUrl})`,
    backgroundSize: options.backgroundSize || 'cover',
    backgroundPosition: options.backgroundPosition || 'center',
    backgroundRepeat: options.backgroundRepeat || 'no-repeat',
    filter: blurFilter,
    zIndex: 0,
    ...(options.backgroundClipPath && options.backgroundClipPath !== 'none' && {
      clipPath: options.backgroundClipPath,
    }),
  } : undefined;

  // Scoper le CSS personnalisé à cette section uniquement
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

  // Générer le CSS pour les tailles personnalisées par balise
  const tagFontSizesCSS = tagFontSizes ? `
    ${tagFontSizes.p ? `[data-section-id="${sectionId}"] p { font-size: ${tagFontSizes.p}px !important; }` : ''}
    ${tagFontSizes.h1 ? `[data-section-id="${sectionId}"] h1 { font-size: ${tagFontSizes.h1}px !important; }` : ''}
    ${tagFontSizes.h2 ? `[data-section-id="${sectionId}"] h2 { font-size: ${tagFontSizes.h2}px !important; }` : ''}
    ${tagFontSizes.h3 ? `[data-section-id="${sectionId}"] h3 { font-size: ${tagFontSizes.h3}px !important; }` : ''}
    ${tagFontSizes.h4 ? `[data-section-id="${sectionId}"] h4 { font-size: ${tagFontSizes.h4}px !important; }` : ''}
    ${tagFontSizes.h5 ? `[data-section-id="${sectionId}"] h5 { font-size: ${tagFontSizes.h5}px !important; }` : ''}
  ` : '';

  // Générer le CSS pour les couleurs personnalisées par balise
  const tagColorsCSS = tagColors ? `
    ${tagColors.p ? `[data-section-id="${sectionId}"] p { color: ${tagColors.p} !important; }` : ''}
    ${tagColors.h1 ? `[data-section-id="${sectionId}"] h1 { color: ${tagColors.h1} !important; }` : ''}
    ${tagColors.h2 ? `[data-section-id="${sectionId}"] h2 { color: ${tagColors.h2} !important; }` : ''}
    ${tagColors.h3 ? `[data-section-id="${sectionId}"] h3 { color: ${tagColors.h3} !important; }` : ''}
    ${tagColors.h4 ? `[data-section-id="${sectionId}"] h4 { color: ${tagColors.h4} !important; }` : ''}
    ${tagColors.h5 ? `[data-section-id="${sectionId}"] h5 { color: ${tagColors.h5} !important; }` : ''}
  ` : '';

  // Calculer le style de l'overlay
  const overlayGradientDirection = options.overlay?.gradientDirection || 'to bottom';
  const overlayGradientStart = options.overlay?.gradientStart || '#000000';
  const overlayGradientEnd = options.overlay?.gradientEnd || '#ffffff';
  const overlayOpacity = (options.overlay?.opacity ?? 50) / 100;
  
  const overlayStyle: React.CSSProperties | null = options.overlay?.enabled && options.overlay.type !== 'color' ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(${overlayGradientDirection}, ${overlayGradientStart}, ${overlayGradientEnd})`,
    opacity: overlayOpacity,
    pointerEvents: 'none',
    zIndex: 2,
  } : null;

  const overlayColorStyle: React.CSSProperties | null = options.overlay?.enabled && options.overlay.type === 'color' ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: options.overlay.color || '#000000',
    opacity: (options.overlay.opacity ?? 50) / 100,
    pointerEvents: 'none',
    zIndex: 2,
  } : null;

  return (
    <>
      {scopedCSS && (
        <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
      )}
      {tagFontSizesCSS && (
        <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />
      )}
      {tagColorsCSS && (
        <style dangerouslySetInnerHTML={{ __html: tagColorsCSS }} />
      )}
      <div
        className="section-texte section-container"
        data-section-id={sectionId}
        style={containerStyle}
      >
        {/* Image de fond avec blur si activé */}
        {backgroundStyle && (
          <div className="section-background-blur" style={backgroundStyle} />
        )}

        {/* Overlay */}
        {overlayStyle && options.overlay && (
          <>
            <style dangerouslySetInnerHTML={{ __html: `
              [data-section-id="${sectionId}"] .section-overlay-gradient {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(${overlayGradientDirection}, ${overlayGradientStart}, ${overlayGradientEnd}) !important;
                opacity: ${overlayOpacity} !important;
                pointer-events: none !important;
                z-index: 10 !important;
              }
            ` }} />
            <div className="section-overlay section-overlay-gradient" />
          </>
        )}
        {overlayColorStyle && (
          <div className="section-overlay" style={overlayColorStyle} />
        )}

        {/* Top Divider */}
        {options.topDividerEnabled && (
          <div
            className="section-divider section-divider-top"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${options.topDividerHeight || 100}px`,
              overflow: 'hidden',
              lineHeight: 0,
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            {options.topDividerType === 'svg' ? (
              <div
                className="section-divider-svg"
                dangerouslySetInnerHTML={{
                  __html: generateDividerSVG(
                    options.topDividerSvgType || 'wave',
                    options.topDividerColor || '#1E90FF',
                    options.topDividerFlip || false
                  ),
                }}
              />
            ) : (
              options.topDividerImageUrl && (
                <img
                  className="section-divider-image"
                  src={options.topDividerImageUrl}
                  alt="Top divider"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: options.topDividerFlip ? 'scaleY(-1)' : 'none',
                  }}
                />
              )
            )}
          </div>
        )}

        {/* Content */}
        <div className="section-content" style={{ position: 'relative', zIndex: 5 }} dangerouslySetInnerHTML={{ __html: data.content }} />

        {/* Bottom Divider */}
        {options.bottomDividerEnabled && (
          <div
            className="section-divider section-divider-bottom"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${options.bottomDividerHeight || 100}px`,
              overflow: 'hidden',
              lineHeight: 0,
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            {options.bottomDividerType === 'svg' ? (
              <div
                className="section-divider-svg"
                dangerouslySetInnerHTML={{
                  __html: generateDividerSVG(
                    options.bottomDividerSvgType || 'wave',
                    options.bottomDividerColor || '#1E90FF',
                    options.bottomDividerFlip || false
                  ),
                }}
              />
            ) : (
              options.bottomDividerImageUrl && (
                <img
                  className="section-divider-image"
                  src={options.bottomDividerImageUrl}
                  alt="Bottom divider"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: options.bottomDividerFlip ? 'scaleY(-1)' : 'none',
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
