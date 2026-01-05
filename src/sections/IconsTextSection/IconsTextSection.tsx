import { useTemplates } from '../../hooks/useSupabase';
import { useEmailStore } from '../../store/emailStore';
import { scopeCSS } from '../../utils/scopeCSS';

interface IconBlock {
  id: string;
  imageUrl?: string;
  title: string;
  text: string;
}

interface IconsTextSectionProps {
  sectionId: string;
  blocks: IconBlock[];
  options: {
    columnsPerRow?: number;
    imageSize?: number;
    gap?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    useTemplatePaddingInline?: boolean;
    useTemplatePaddingBlock?: boolean;
    textAlign?: 'left' | 'center' | 'right';
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

export function IconsTextSection({ sectionId, blocks, options }: IconsTextSectionProps) {
  const { currentTemplateId } = useEmailStore();
  const { templates } = useTemplates();
  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  const {
    columnsPerRow = 2,
    imageSize = 80,
    gap = 20,
    paddingTop = 40,
    paddingBottom = 40,
    paddingLeft = 40,
    paddingRight = 40,
    useTemplatePaddingInline = false,
    useTemplatePaddingBlock = false,
    textAlign = 'center',
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
    tagFontSizes,
    tagColors,
    customCSS = '',
  } = options;

  const finalPaddingTop = useTemplatePaddingBlock && currentTemplate ? currentTemplate.paddingBlock : paddingTop;
  const finalPaddingBottom = useTemplatePaddingBlock && currentTemplate ? currentTemplate.paddingBlock : paddingBottom;
  const finalPaddingLeft = useTemplatePaddingInline && currentTemplate ? currentTemplate.paddingInline : paddingLeft;
  const finalPaddingRight = useTemplatePaddingInline && currentTemplate ? currentTemplate.paddingInline : paddingRight;

  // Générer le style de fond
  let backgroundStyle: React.CSSProperties = {};
  
  if (backgroundEnabled) {
    if (backgroundType === 'color') {
      backgroundStyle = { backgroundColor };
    } else if (backgroundType === 'gradient') {
      const gradientCSS = gradientDirection === 'radial'
        ? `radial-gradient(circle, ${gradientStart}, ${gradientEnd})`
        : `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
      backgroundStyle = { background: gradientCSS };
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
    gap: `${gap}px`,
    width: '100%',
  };

  const blockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
    textAlign,
  };

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

  return (
    <>
      {scopedCSS && <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />}
      {tagFontSizesCSS && <style dangerouslySetInnerHTML={{ __html: tagFontSizesCSS }} />}
      {tagColorsCSS && <style dangerouslySetInnerHTML={{ __html: tagColorsCSS }} />}
      <div
        className="section-icons-text section-container"
        data-section-id={sectionId}
        style={containerStyle}
      >
        <div style={gridStyle}>
          {blocks.map((block) => (
            <div key={block.id} style={blockStyle}>
              {block.imageUrl && (
                <img
                  src={block.imageUrl}
                  alt={block.title}
                  style={{
                    width: `${imageSize}px`,
                    height: `${imageSize}px`,
                    objectFit: 'contain',
                    marginBottom: '16px',
                  }}
                />
              )}
              <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                {block.title}
              </h3>
              <p style={{ margin: 0 }}>
                {block.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
