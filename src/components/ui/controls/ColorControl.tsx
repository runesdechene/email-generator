import type { GlobalStyleTemplate } from '../../../types/supabase';

interface ColorControlProps {
  color?: string;
  currentTemplate?: GlobalStyleTemplate;
  onUpdate: (path: string[], value: any) => void;
}

export function ColorControl({ color = 'primary', currentTemplate, onUpdate }: ColorControlProps) {
  const allTemplateColors = ['primary', 'secondary', 'background', 'text', 'accent', ...(currentTemplate?.customColors?.map(c => c.name) || [])];
  const isTemplateColor = allTemplateColors.includes(color);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        Couleur
      </label>
      
      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => {
              if (!isTemplateColor) {
                onUpdate(['color'], 'primary');
              }
            }}
            className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
              isTemplateColor
                ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
            }`}
          >
            Variable du template
          </button>
          <button
            onClick={() => {
              if (isTemplateColor) {
                onUpdate(['color'], '#000000');
              }
            }}
            className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
              !isTemplateColor
                ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
            }`}
          >
            Couleur personnalisée
          </button>
        </div>
      </div>

      {isTemplateColor && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Couleurs principales</p>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {(['primary', 'secondary', 'background', 'text', 'accent'] as const).map((colorKey) => {
              const colorValue = currentTemplate?.colors[colorKey] || '#000000';
              const isSelected = color === colorKey;
              
              return (
                <button
                  key={colorKey}
                  onClick={() => onUpdate(['color'], colorKey)}
                  className={`relative aspect-square rounded-lg border-2 transition-all ${
                    isSelected ? 'border-[#1E90FF] ring-2 ring-blue-200 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                  }`}
                  style={{ backgroundColor: colorValue }}
                  title={`${colorKey}: ${colorValue}`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {currentTemplate?.customColors && currentTemplate.customColors.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-2">Couleurs personnalisées</p>
              <div className="grid grid-cols-5 gap-2">
                {currentTemplate.customColors.map((customColor) => {
                  const isSelected = color === customColor.name;
                  
                  return (
                    <button
                      key={customColor.name}
                      onClick={() => onUpdate(['color'], customColor.name)}
                      className={`relative aspect-square rounded-lg border-2 transition-all ${
                        isSelected ? 'border-[#1E90FF] ring-2 ring-blue-200 shadow-sm' : 'border-gray-300 hover:border-[#1E90FF]'
                      }`}
                      style={{ backgroundColor: customColor.value }}
                      title={`${customColor.name}: ${customColor.value}`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {!isTemplateColor && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onUpdate(['color'], e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onUpdate(['color'], e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            placeholder="#000000"
          />
        </div>
      )}
    </div>
  );
}
