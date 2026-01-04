import type { GlobalStyleTemplate } from '../../../types/supabase';

interface FontSizeControlProps {
  fontSize?: string | number;
  currentTemplate?: GlobalStyleTemplate;
  onUpdate: (path: string[], value: any) => void;
}

export function FontSizeControl({ fontSize = 'xl', currentTemplate, onUpdate }: FontSizeControlProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        Taille de police
      </label>
      
      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => {
              if (typeof fontSize === 'number') {
                onUpdate(['fontSize'], 'xl');
              }
            }}
            className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
              typeof fontSize === 'string'
                ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
            }`}
          >
            Variable du template
          </button>
          <button
            onClick={() => {
              if (typeof fontSize === 'string') {
                onUpdate(['fontSize'], 16);
              }
            }}
            className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
              typeof fontSize === 'number' || fontSize === undefined
                ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
            }`}
          >
            Taille personnalisée
          </button>
        </div>
      </div>

      {typeof fontSize === 'string' && (
        <div className="grid grid-cols-3 gap-2">
          {(['xxl', 'xl', 'l', 'm', 's', 'xs'] as const).map((sizeKey) => {
            const sizeValue = currentTemplate?.fontSizes[sizeKey] || 16;
            const isSelected = fontSize === sizeKey;
            
            return (
              <button
                key={sizeKey}
                onClick={() => onUpdate(['fontSize'], sizeKey)}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  isSelected ? 'border-[#1E90FF] bg-blue-50 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                }`}
              >
                <p className={`font-semibold ${
                  isSelected ? 'text-[#1E90FF]' : 'text-gray-900'
                }`}>{sizeKey.toUpperCase()}</p>
                <p className="text-xs text-gray-500">{sizeValue}px</p>
              </button>
            );
          })}
        </div>
      )}

      {(typeof fontSize === 'number' || fontSize === undefined) && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="8"
            max="72"
            value={typeof fontSize === 'number' ? fontSize : 16}
            onChange={(e) => onUpdate(['fontSize'], parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
          />
          <input
            type="number"
            min="8"
            max="72"
            value={typeof fontSize === 'number' ? fontSize : 16}
            onChange={(e) => onUpdate(['fontSize'], parseInt(e.target.value) || 16)}
            className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          />
        </div>
      )}
    </div>
  );
}
