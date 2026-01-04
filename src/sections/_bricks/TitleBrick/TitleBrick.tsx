interface TitleBrickProps {
  value: string;
  options?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | 'extrabold';
    color?: string;
    align?: 'left' | 'center' | 'right';
  };
  style?: React.CSSProperties;
}

export function TitleBrick({ value, options = {}, style }: TitleBrickProps) {
  const {
    fontSize = 24,
    fontWeight = 'bold',
    color = '#1f2937',
    align = 'left',
  } = options;

  const fontWeightMap = {
    normal: 400,
    bold: 700,
    extrabold: 800,
  };

  return (
    <h2
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightMap[fontWeight],
        color,
        textAlign: align,
        margin: 0,
        ...style,
      }}
    >
      {value}
    </h2>
  );
}
