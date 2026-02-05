import { useState, useRef, useCallback } from 'react';
import { Move } from 'lucide-react';

interface BackgroundPositionPickerProps {
  value: string;
  onChange: (position: string) => void;
  previewImage?: string;
}

// Convertir une position CSS en pourcentages
const parsePosition = (position: string): { x: number; y: number } => {
  const positionMap: Record<string, { x: number; y: number }> = {
    'top left': { x: 0, y: 0 },
    'top center': { x: 50, y: 0 },
    'top': { x: 50, y: 0 },
    'top right': { x: 100, y: 0 },
    'center left': { x: 0, y: 50 },
    'left': { x: 0, y: 50 },
    'center': { x: 50, y: 50 },
    'center right': { x: 100, y: 50 },
    'right': { x: 100, y: 50 },
    'bottom left': { x: 0, y: 100 },
    'bottom center': { x: 50, y: 100 },
    'bottom': { x: 50, y: 100 },
    'bottom right': { x: 100, y: 100 },
  };

  if (positionMap[position]) {
    return positionMap[position];
  }

  // Parser les valeurs en pourcentage (ex: "25% 75%")
  const match = position.match(/(\d+)%\s*(\d+)%/);
  if (match) {
    return { x: parseInt(match[1]), y: parseInt(match[2]) };
  }

  return { x: 50, y: 50 };
};

export function BackgroundPositionPicker({ 
  value, 
  onChange, 
  previewImage 
}: BackgroundPositionPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const position = parsePosition(value);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    // Limiter entre 0 et 100
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    // Arrondir à l'entier
    x = Math.round(x);
    y = Math.round(y);

    onChange(`${x}% ${y}%`);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX, e.clientY);
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  // Positions prédéfinies pour les boutons rapides
  const presetPositions = [
    { label: '↖', value: '0% 0%' },
    { label: '↑', value: '50% 0%' },
    { label: '↗', value: '100% 0%' },
    { label: '←', value: '0% 50%' },
    { label: '●', value: '50% 50%' },
    { label: '→', value: '100% 50%' },
    { label: '↙', value: '0% 100%' },
    { label: '↓', value: '50% 100%' },
    { label: '↘', value: '100% 100%' },
  ];

  return (
    <div className="space-y-3">
      {/* Zone de positionnement interactive */}
      <div 
        ref={containerRef}
        className="relative w-full h-32 bg-gray-100 border-2 border-gray-300 rounded-lg cursor-crosshair overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundImage: previewImage ? `url(${previewImage})` : 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
          backgroundSize: previewImage ? 'cover' : '20px 20px',
          backgroundPosition: previewImage ? value : '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        {/* Grille de référence */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Lignes verticales */}
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300/50" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400/50" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300/50" />
          {/* Lignes horizontales */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400/50" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300/50" />
        </div>

        {/* Marqueur de position */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
        >
          <div className="w-full h-full rounded-full bg-[#1E90FF] border-2 border-white shadow-lg flex items-center justify-center">
            <Move size={12} className="text-white" />
          </div>
          {/* Lignes de guidage depuis le marqueur */}
          <div 
            className="absolute left-1/2 bottom-full w-px bg-[#1E90FF]/50 -translate-x-1/2"
            style={{ height: `${position.y * 1.28}px` }}
          />
          <div 
            className="absolute top-1/2 right-full h-px bg-[#1E90FF]/50 -translate-y-1/2"
            style={{ width: `${position.x * 2.4}px` }}
          />
        </div>

        {/* Indicateur de drag */}
        {isDragging && (
          <div className="absolute inset-0 bg-[#1E90FF]/10 pointer-events-none" />
        )}
      </div>

      {/* Affichage de la valeur actuelle */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Position : <span className="font-mono text-gray-700">{value}</span></span>
        <span className="text-gray-400">Cliquez ou glissez pour positionner</span>
      </div>

      {/* Boutons de positions prédéfinies */}
      <div className="grid grid-cols-3 gap-1">
        {presetPositions.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`px-2 py-1.5 text-sm rounded border transition-all ${
              value === preset.value || 
              (preset.value === '50% 50%' && value === 'center') ||
              (preset.value === '0% 0%' && value === 'top left') ||
              (preset.value === '50% 0%' && (value === 'top' || value === 'top center')) ||
              (preset.value === '100% 0%' && value === 'top right') ||
              (preset.value === '0% 50%' && (value === 'left' || value === 'center left')) ||
              (preset.value === '100% 50%' && (value === 'right' || value === 'center right')) ||
              (preset.value === '0% 100%' && value === 'bottom left') ||
              (preset.value === '50% 100%' && (value === 'bottom' || value === 'bottom center')) ||
              (preset.value === '100% 100%' && value === 'bottom right')
                ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]'
            }`}
            title={preset.value}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
