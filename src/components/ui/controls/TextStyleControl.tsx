interface TextStyleControlProps {
  align?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  onUpdate: (path: string[], value: any) => void;
}

export function TextStyleControl({
  align = 'left',
  bold = false,
  italic = false,
  underline = false,
  lineHeight = 1.5,
  letterSpacing = 0,
  onUpdate,
}: TextStyleControlProps) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-xs font-semibold text-gray-700 mb-3">Style du texte</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Alignement
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['left', 'center', 'right', 'justify'].map((alignValue) => (
              <button
                key={alignValue}
                onClick={() => onUpdate(['textStyle', 'align'], alignValue)}
                className={`px-2 py-1.5 text-xs rounded border transition-all ${
                  align === alignValue
                    ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                }`}
              >
                {alignValue === 'left' && 'Left'}
                {alignValue === 'center' && 'Center'}
                {alignValue === 'right' && 'Right'}
                {alignValue === 'justify' && 'Justify'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Décoration
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(['textStyle', 'bold'], !bold)}
              className={`flex-1 px-3 py-2 text-xs font-bold rounded border transition-all ${
                bold
                  ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
              }`}
            >
              B
            </button>
            <button
              onClick={() => onUpdate(['textStyle', 'italic'], !italic)}
              className={`flex-1 px-3 py-2 text-xs italic rounded border transition-all ${
                italic
                  ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
              }`}
            >
              I
            </button>
            <button
              onClick={() => onUpdate(['textStyle', 'underline'], !underline)}
              className={`flex-1 px-3 py-2 text-xs underline rounded border transition-all ${
                underline
                  ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
              }`}
            >
              U
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Hauteur de ligne
          </label>
          <input
            type="number"
            step="0.1"
            value={lineHeight}
            onChange={(e) => onUpdate(['textStyle', 'lineHeight'], parseFloat(e.target.value) || 1.5)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Espacement des lettres (px)
          </label>
          <input
            type="number"
            step="0.5"
            value={letterSpacing}
            onChange={(e) => onUpdate(['textStyle', 'letterSpacing'], parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          />
        </div>
      </div>
    </div>
  );
}
