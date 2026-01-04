import { TitleBrick } from '../_bricks/TitleBrick';
import { ParagraphBrick } from '../_bricks/ParagraphBrick';

interface ParagraphSectionProps {
  data: {
    title: string;
    subtitle: string;
  };
  options?: {
    title?: {
      fontSize?: number;
      fontWeight?: 'normal' | 'bold' | 'extrabold';
      color?: string;
      align?: 'left' | 'center' | 'right';
    };
    subtitle?: {
      fontSize?: number;
      color?: string;
      align?: 'left' | 'center' | 'right';
      lineHeight?: number;
    };
    container?: {
      padding?: number;
      backgroundColor?: string;
    };
  };
}

export function ParagraphSection({ data, options = {} }: ParagraphSectionProps) {
  const containerPadding = options.container?.padding ?? 32;
  const containerBgColor = options.container?.backgroundColor ?? 'transparent';

  return (
    <div
      style={{
        padding: `${containerPadding}px`,
        backgroundColor: containerBgColor,
      }}
    >
      <TitleBrick 
        value={data.title} 
        options={options.title}
        style={{ marginBottom: '16px' }}
      />
      <ParagraphBrick 
        value={data.subtitle} 
        options={options.subtitle}
      />
    </div>
  );
}
