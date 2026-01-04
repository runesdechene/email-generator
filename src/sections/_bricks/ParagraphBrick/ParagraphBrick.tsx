interface ParagraphBrickProps {
  value: string;
  options?: {
    fontSize?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
    lineHeight?: number;
  };
  style?: React.CSSProperties;
}

export function ParagraphBrick({ value, options = {}, style }: ParagraphBrickProps) {
  const {
    fontSize = 16,
    color = '#6b7280',
    align = 'left',
    lineHeight = 1.6,
  } = options;

  return (
    <p
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign: align,
        lineHeight,
        margin: 0,
        ...style,
      }}
    >
      {value}
    </p>
  );
}
