import React from 'react';
import { scopeCSS } from '../../utils/scopeCSS';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates } from '../../hooks/useSupabase';

interface ImageTextSectionProps {
  sectionId: string;
  content: {
    content?: string;
  };
  options: {
    imageUrl?: string;
    imageSize?: number;
    clipPath?: string;
    overlay?: {
      enabled?: boolean;
      type?: 'color' | 'gradient';
      color?: string;
      gradientStart?: string;
      gradientEnd?: string;
      gradientDirection?: string;
      opacity?: number;
      blur?: number;
    };
    color?: string;
    fontSize?: number;
    font?: string;
    textStyle?: {
      align?: 'left' | 'center' | 'right';
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
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
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
}

export const ImageTextSection: React.FC<ImageTextSectionProps> = ({
  sectionId,
  content = {},
  options = {},
}) => {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();
  
  const {
    imageUrl,
    imageSize = 100,
    clipPath = 'none',
    overlay,
    color = '#ffffff',
    fontSize: _fontSize = 16,
    font = 'paragraph',
    textStyle: textStyleOptions = {},
    tagFontSizes,
    tagColors,
    customCSS = '',
    paddingTop = 40,
    paddingBottom = 40,
    paddingLeft = 40,
    paddingRight = 40,
  } = options;

  // Récupérer le template actuel pour obtenir les polices
  const currentTemplate = templates.find(t => t.id === currentTemplateId);

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

  const {
    align = 'left',
    bold = false,
    italic = false,
    underline = false,
    lineHeight = 1.5,
    letterSpacing = 0,
  } = textStyleOptions;

  // Scoper le CSS personnalisé à cette section uniquement
  const scopedCSS = customCSS ? scopeCSS(customCSS, sectionId) : '';

  // Générer le filtre blur si activé
  const blurValue = overlay?.blur || 0;
  const blurFilter = blurValue > 0 ? `blur(${blurValue}px)` : 'none';

  // Calculer le style de l'overlay
  const overlayGradientDirection = overlay?.gradientDirection || 'to bottom';
  const overlayGradientStart = overlay?.gradientStart || '#000000';
  const overlayGradientEnd = overlay?.gradientEnd || '#ffffff';
  const overlayOpacity = (overlay?.opacity ?? 50) / 100;
  
  const overlayStyle: React.CSSProperties | null = overlay?.enabled && overlay.type !== 'color' ? {
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

  const overlayColorStyle: React.CSSProperties | null = overlay?.enabled && overlay.type === 'color' ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: overlay.color || '#000000',
    opacity: overlayOpacity,
    pointerEvents: 'none',
    zIndex: 2,
  } : null;

  const containerStyle: React.CSSProperties = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: `${imageSize}%`,
    width: '100%',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    display: 'block',
    clipPath: clipPath !== 'none' ? clipPath : undefined,
    filter: blurFilter !== 'none' ? blurFilter : undefined,
  };

  const textContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    padding: '40px',
    zIndex: 5,
    pointerEvents: 'none',
  };

  // Mapper font (title/paragraph) à une fontFamily CSS depuis le template
  const _fontFamily = font === 'title' 
    ? currentTemplate?.fonts.title || 'Georgia, serif'
    : currentTemplate?.fonts.paragraph || 'Arial, sans-serif';
  void _fontFamily; // Variable préparée pour usage futur

  const textStyle: React.CSSProperties = {
    color,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textAlign: align,
    maxWidth: '100%',
  };

  if (!imageUrl) {
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
          className="section-image-text section-container"
          data-section-id={sectionId}
          style={{
            ...containerStyle,
            minHeight: '200px',
            backgroundColor: '#f3f4f6',
            border: '2px dashed #d1d5db',
          }}
        >
          <p className="text-gray-400 text-sm">Aucune image sélectionnée</p>
        </div>
      </>
    );
  }

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
        className="section-image-text section-container"
        data-section-id={sectionId}
        style={containerStyle}
      >
        <div style={imageContainerStyle}>
          <img
            src={imageUrl}
            alt="Section"
            style={imageStyle}
          />
          
          {/* Overlay */}
          {overlayStyle && overlay && (
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
                  clip-path: ${clipPath !== 'none' ? clipPath : 'none'} !important;
                }
              ` }} />
              <div className="section-overlay section-overlay-gradient" />
            </>
          )}
          {overlayColorStyle && (
            <div 
              className="section-overlay" 
              style={{
                ...overlayColorStyle,
                clipPath: clipPath !== 'none' ? clipPath : undefined,
              }} 
            />
          )}

          {/* Texte superposé */}
          <div style={textContainerStyle}>
            <div 
              style={textStyle}
              dangerouslySetInnerHTML={{ __html: content.content || '<p>Votre contenu ici...</p>' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
