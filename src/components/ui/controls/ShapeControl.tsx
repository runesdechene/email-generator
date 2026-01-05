import React from 'react';

interface ShapeControlProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

const PRESET_SHAPES = [
  { name: 'Aucune', value: 'none' },
  { name: 'Cercle', value: 'circle(50% at 50% 50%)' },
  { name: 'Ellipse', value: 'ellipse(50% 40% at 50% 50%)' },
  { name: 'Bords arrondis', value: 'inset(0 round 20px)' },
  { name: 'Hexagone', value: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
  { name: 'Triangle', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { name: 'Losange', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { name: 'Parallélogramme', value: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
  { name: 'Trapèze', value: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
  { name: 'Pentagone', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { name: 'Étoile', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { name: 'Flèche droite', value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
  { name: 'Vague haut', value: 'polygon(0% 20%, 20% 0%, 40% 20%, 60% 0%, 80% 20%, 100% 0%, 100% 100%, 0% 100%)' },
  { name: 'Vague bas', value: 'polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 60% 80%, 40% 100%, 20% 80%, 0% 100%)' },
  { name: 'Bords penchés', value: 'polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)' },
  { name: 'Découpe coin', value: 'polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%)' },
];

export const ShapeControl: React.FC<ShapeControlProps> = ({
  value = 'none',
  onChange,
  label = 'Forme (Clip-path)',
}) => {
  const [customShape, setCustomShape] = React.useState('');
  const [isCustom, setIsCustom] = React.useState(false);

  React.useEffect(() => {
    const isPreset = PRESET_SHAPES.some(shape => shape.value === value);
    if (!isPreset && value && value !== 'none') {
      setIsCustom(true);
      setCustomShape(value);
    }
  }, [value]);

  const handlePresetChange = (newValue: string) => {
    setIsCustom(false);
    onChange(newValue);
  };

  const handleCustomChange = (newValue: string) => {
    setCustomShape(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      
      <div className="space-y-2">
        <select
          value={isCustom ? 'custom' : value}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              setIsCustom(true);
            } else {
              handlePresetChange(e.target.value);
            }
          }}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PRESET_SHAPES.map((shape) => (
            <option key={shape.value} value={shape.value}>
              {shape.name}
            </option>
          ))}
          <option value="custom">Personnalisé...</option>
        </select>

        {isCustom && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Clip-path personnalisé
            </label>
            <textarea
              value={customShape}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              rows={3}
              placeholder="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Utilisez la syntaxe CSS clip-path (polygon, circle, ellipse, etc.)
            </p>
          </div>
        )}
      </div>

      {value && value !== 'none' && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs font-medium text-gray-600 mb-2">Aperçu :</p>
          <div className="flex justify-center">
            <div
              className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500"
              style={{
                clipPath: value,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
