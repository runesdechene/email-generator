interface ClipPathControlProps {
  clipPath?: string;
  onUpdate: (path: string[], value: any) => void;
}

export function ClipPathControl({ clipPath = 'none', onUpdate }: ClipPathControlProps) {
  const clipPaths = [
    { value: 'none', label: 'Aucun', preview: 'rect(0% 100% 100% 0%)' },
    { value: 'circle(50%)', label: 'Cercle', preview: 'circle(50%)' },
    { value: 'ellipse(50% 40%)', label: 'Ellipse', preview: 'ellipse(50% 40%)' },
    { value: 'inset(0 round 10px)', label: 'Arrondi léger', preview: 'inset(0 round 10px)' },
    { value: 'inset(0 round 20px)', label: 'Arrondi moyen', preview: 'inset(0 round 20px)' },
    { value: 'inset(0 round 50px)', label: 'Arrondi fort', preview: 'inset(0 round 50px)' },
    { value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', label: 'Losange', preview: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    { value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', label: 'Pentagone', preview: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { value: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', label: 'Hexagone', preview: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
    { value: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', label: 'Octogone', preview: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-700">
        Forme de l'image (Clip-path)
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Choisissez une forme pour découper l'image
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {clipPaths.map(({ value, label, preview }) => (
          <button
            key={value}
            onClick={() => onUpdate(['clipPath'], value)}
            className={`relative p-3 rounded-lg border-2 transition-all ${
              clipPath === value
                ? 'border-[#1E90FF] bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500" style={{ clipPath: preview }} />
              <span className="text-xs text-gray-700 text-center leading-tight">{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
