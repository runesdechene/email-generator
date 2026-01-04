import React from 'react';

interface OverlayControlProps {
  value: {
    enabled?: boolean;
    type?: 'color' | 'gradient';
    color?: string;
    gradientStart?: string;
    gradientEnd?: string;
    gradientDirection?: 'to bottom' | 'to top' | 'to right' | 'to left' | 'to bottom right' | 'to bottom left';
    opacity?: number;
    blur?: number;
  };
  onChange: (value: OverlayControlProps['value']) => void;
  label?: string;
}

export const OverlayControl: React.FC<OverlayControlProps> = ({
  value = {},
  onChange,
  label = 'Overlay (Calque)',
}) => {
  const {
    enabled = false,
    type = 'color',
    color = '#000000',
    gradientStart = '#000000',
    gradientEnd = '#ffffff',
    gradientDirection = 'to bottom',
    opacity = 50,
    blur = 0,
  } = value;

  const handleChange = (updates: Partial<OverlayControlProps['value']>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleChange({ enabled: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Activer</span>
        </label>
      </div>

      {enabled && (
        <>
          {/* Type d'overlay */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Type d'overlay
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleChange({ type: 'color' })}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  type === 'color'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Couleur unie
              </button>
              <button
                type="button"
                onClick={() => handleChange({ 
                  type: 'gradient',
                  gradientStart: gradientStart || '#000000',
                  gradientEnd: gradientEnd || '#ffffff',
                  gradientDirection: gradientDirection || 'to bottom'
                })}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  type === 'gradient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Dégradé
              </button>
            </div>
          </div>

          {/* Couleur unie */}
          {type === 'color' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Couleur
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleChange({ color: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleChange({ color: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {/* Dégradé */}
          {type === 'gradient' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Couleur de départ
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => handleChange({ gradientStart: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => handleChange({ gradientStart: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Couleur de fin
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => handleChange({ gradientEnd: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => handleChange({ gradientEnd: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Direction du dégradé
                </label>
                <select
                  value={gradientDirection}
                  onChange={(e) =>
                    handleChange({
                      gradientDirection: e.target.value as typeof gradientDirection,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="to bottom">Haut → Bas</option>
                  <option value="to top">Bas → Haut</option>
                  <option value="to right">Gauche → Droite</option>
                  <option value="to left">Droite → Gauche</option>
                  <option value="to bottom right">Haut-Gauche → Bas-Droite</option>
                  <option value="to bottom left">Haut-Droite → Bas-Gauche</option>
                </select>
              </div>
            </>
          )}

          {/* Opacité */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Opacité: {opacity}%
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => handleChange({ opacity: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => handleChange({ opacity: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Blur de l'image de fond */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Flou de l'image de fond: {blur}px
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => handleChange({ blur: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => handleChange({ blur: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Applique un flou sur l'image de fond (0-20px)
            </p>
          </div>

          {/* Aperçu */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Aperçu
            </label>
            <div
              className="w-full h-20 rounded-md border border-gray-300"
              style={{
                background:
                  type === 'color'
                    ? color
                    : `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`,
                opacity: opacity / 100,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
