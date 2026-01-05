import { useTemplates } from '../../hooks/useSupabase';
import { scopeCSS } from '../../utils/scopeCSS';
import { generateDividerSVG } from '../../utils/dividerSVG';
import { generateBackgroundBlur } from '../../utils/overlayStyle';
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

  // Gérer les dividers
  const topDividerEnabled = options.topDividerEnabled || false;
  const bottomDividerEnabled = options.bottomDividerEnabled || false;

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

  // Gérer la police (par défaut: paragraph)
  const font = options.font || 'paragraph';
  const fontFamily = font === 'title' 
    ? currentTemplate?.fonts.title || 'Georgia, serif'
    : currentTemplate?.fonts.paragraph || 'Arial, sans-serif';

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

  // Générer le CSS pour les tailles personnalisées par balise
  const tagFontSizes = (options as any).tagFontSizes;
  const tagFontSizesCSS = tagFontSizes ? `
    ${tagFontSizes.p ? `[data-section-id="${sectionId}"] p { font-size: ${tagFontSizes.p}px !important; }` : ''}
    ${tagFontSizes.h1 ? `[data-section-id="${sectionId}"] h1 { font-size: ${tagFontSizes.h1}px !important; }` : ''}
    ${tagFontSizes.h2 ? `[data-section-id="${sectionId}"] h2 { font-size: ${tagFontSizes.h2}px !important; }` : ''}
    ${tagFontSizes.h3 ? `[data-section-id="${sectionId}"] h3 { font-size: ${tagFontSizes.h3}px !important; }` : ''}
    ${tagFontSizes.h4 ? `[data-section-id="${sectionId}"] h4 { font-size: ${tagFontSizes.h4}px !important; }` : ''}
    ${tagFontSizes.h5 ? `[data-section-id="${sectionId}"] h5 { font-size: ${tagFontSizes.h5}px !important; }` : ''}
  ` : '';

  // Générer le filtre blur si activé
  const blurValue = options.overlay?.blur || 0;
  const blurFilter = generateBackgroundBlur(blurValue);

  const style: React.CSSProperties = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    color,
    textAlign: textAlign as any,
    fontWeight,
    fontStyle,
    textDecoration,
    lineHeight,
    position: 'relative',
    // Appliquer l'image de fond directement si pas de blur
    ...(backgroundImageUrl && blurValue === 0 && {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize,
      backgroundPosition,
      backgroundRepeat,
    }),
  };

  // Style pour l'image de fond avec blur si activé
  const backgroundStyle: React.CSSProperties | undefined = backgroundImageUrl && blurValue > 0 ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    filter: blurFilter,
    zIndex: 0,
  } : undefined;

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
    opacity: overlayOpacity,
    pointerEvents: 'none',
    zIndex: 2,
  } : null;

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
        {tagFontSizesCSS && (
          <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />
        )}
        <div className="section-hero section-container" style={{ ...style, position: 'relative', overflow: 'hidden' }} data-section-id={sectionId}>
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
          {topDividerEnabled && (
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

          <div className="section-content-wrapper" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
            zIndex: 5,
          }}>
            <img 
              className="section-hero-image"
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
              className="section-content"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Bottom Divider */}
          {bottomDividerEnabled && (
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

  // Sans image, juste le contenu
  return (
    <>
      {scopedCSS && (
        <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
      )}
      {tagFontSizesCSS && (
        <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />
      )}
      <div 
        className="section-hero section-container"
        style={{ ...style, position: 'relative', overflow: 'hidden' }}
        data-section-id={sectionId}
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
        {topDividerEnabled && (
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
        <div 
          className="section-content"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ position: 'relative', zIndex: 5 }}
        />

        {/* Bottom Divider */}
        {bottomDividerEnabled && (
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
