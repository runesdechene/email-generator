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
    backgroundImageUrl?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
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

  // Générer le filtre blur si activé
  const blurValue = options.overlay?.blur || 0;
  const blurFilter = generateBackgroundBlur(blurValue);

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
    // N'appliquer l'image de fond que si pas de blur
    ...(options.backgroundImageUrl && blurValue === 0 && {
      backgroundImage: `url(${options.backgroundImageUrl})`,
      backgroundSize: options.backgroundSize || 'cover',
      backgroundPosition: options.backgroundPosition || 'center',
      backgroundRepeat: options.backgroundRepeat || 'no-repeat',
    }),
  };

  // Ajouter le style pour l'image de fond avec blur
  const containerStyle: React.CSSProperties = {
    ...baseStyle,
    position: 'relative',
    overflow: 'hidden',
  };

  // Style pour un élément qui contiendra l'image de fond avec blur
  const backgroundStyle: React.CSSProperties | undefined = options.backgroundImageUrl && blurValue > 0 ? {
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
  } : undefined;

  // Scoper le CSS personnalisé à cette section uniquement
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

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
