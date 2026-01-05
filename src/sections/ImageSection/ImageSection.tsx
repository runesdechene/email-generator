import React from 'react';
import { scopeCSS } from '../../utils/scopeCSS';

interface ImageSectionProps {
  sectionId: string;
  options: {
    imageUrl?: string;
    imageSize?: number;
    imageHeight?: number;
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
    customCSS?: string;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  sectionId,
  options = {},
}) => {
  const {
    imageUrl,
    imageSize = 100,
    imageHeight,
    clipPath = 'none',
    overlay,
    customCSS = '',
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
  } = options;

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
    height: imageHeight ? `${imageHeight}px` : 'auto',
    display: 'block',
    clipPath: clipPath !== 'none' ? clipPath : undefined,
    filter: blurFilter !== 'none' ? blurFilter : undefined,
    objectFit: imageHeight ? 'cover' : undefined,
  };

  if (!imageUrl) {
    return (
      <>
        {scopedCSS && (
          <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
        )}
        <div
          className="section-image section-container"
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
      <div
        className="section-image section-container"
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
        </div>
      </div>
    </>
  );
};
