import { ImagePicker } from '../ImagePicker';

interface BackgroundControlProps {
  backgroundEnabled?: boolean;
  backgroundType?: 'color' | 'gradient' | 'image';
  backgroundColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundClipPath?: string;
  sectionId: string;
  onUpdate: (path: string[], value: any) => void;
}

const GRADIENT_DIRECTIONS = [
  { value: 'to bottom', label: 'Haut → Bas' },
  { value: 'to top', label: 'Bas → Haut' },
  { value: 'to right', label: 'Gauche → Droite' },
  { value: 'to left', label: 'Droite → Gauche' },
  { value: 'to bottom right', label: 'Diagonale ↘' },
  { value: 'to bottom left', label: 'Diagonale ↙' },
  { value: 'radial', label: 'Radial (centre)' },
];

const CLIP_PATHS = [
  { value: 'none', label: 'Aucun' },
  { value: 'circle(50%)', label: 'Cercle' },
  { value: 'ellipse(50% 40%)', label: 'Ellipse' },
  { value: 'inset(0 round 20px)', label: 'Arrondi' },
  { value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', label: 'Losange' },
];

export function BackgroundControl({
  backgroundEnabled = false,
  backgroundType = 'color',
  backgroundColor = '#ffffff',
  gradientStart = '#667eea',
  gradientEnd = '#764ba2',
  gradientDirection = 'to bottom',
  backgroundImageUrl,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
  backgroundClipPath = 'none',
  sectionId,
  onUpdate,
}: BackgroundControlProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`background-enabled-${sectionId}`}
          checked={backgroundEnabled}
          onChange={(e) => onUpdate(['backgroundEnabled'], e.target.checked)}
          className="w-4 h-4 text-[#1E90FF] bg-gray-100 border-gray-300 rounded focus:ring-[#1E90FF] focus:ring-2"
        />
        <label htmlFor={`background-enabled-${sectionId}`} className="text-sm font-medium text-gray-700 cursor-pointer">
          Activer le fond de section
        </label>
      </div>

      {backgroundEnabled && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Type de fond
            </label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(['backgroundType'], 'color')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
              backgroundType === 'color'
                ? 'bg-[#1E90FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Couleur
          </button>
          <button
            onClick={() => onUpdate(['backgroundType'], 'gradient')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
              backgroundType === 'gradient'
                ? 'bg-[#1E90FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dégradé
          </button>
          <button
            onClick={() => onUpdate(['backgroundType'], 'image')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
              backgroundType === 'image'
                ? 'bg-[#1E90FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Image
          </button>
        </div>
      </div>

      {backgroundType === 'color' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Couleur de fond
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onUpdate(['backgroundColor'], e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => onUpdate(['backgroundColor'], e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            />
          </div>
        </div>
      )}

      {backgroundType === 'gradient' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Direction du dégradé
            </label>
            <select
              value={gradientDirection}
              onChange={(e) => onUpdate(['gradientDirection'], e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            >
              {GRADIENT_DIRECTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Couleur de départ
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => onUpdate(['gradientStart'], e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientStart}
                onChange={(e) => onUpdate(['gradientStart'], e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Couleur de fin
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => onUpdate(['gradientEnd'], e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientEnd}
                onChange={(e) => onUpdate(['gradientEnd'], e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
              />
            </div>
          </div>
        </>
      )}

      {backgroundType === 'image' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Image de fond
            </label>
            <ImagePicker
              value={backgroundImageUrl || ''}
              onChange={(url) => onUpdate(['backgroundImageUrl'], url)}
              sectionId={sectionId}
              label="Image de fond"
            />
          </div>
          {backgroundImageUrl && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Taille
                </label>
                <select
                  value={backgroundSize}
                  onChange={(e) => onUpdate(['backgroundSize'], e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                >
                  <option value="cover">Couvrir</option>
                  <option value="contain">Contenir</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={backgroundPosition}
                  onChange={(e) => onUpdate(['backgroundPosition'], e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                >
                  <option value="center">Centre</option>
                  <option value="top">Haut</option>
                  <option value="bottom">Bas</option>
                  <option value="left">Gauche</option>
                  <option value="right">Droite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Répétition
                </label>
                <select
                  value={backgroundRepeat}
                  onChange={(e) => onUpdate(['backgroundRepeat'], e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                >
                  <option value="no-repeat">Aucune</option>
                  <option value="repeat">Répéter</option>
                  <option value="repeat-x">Répéter horizontalement</option>
                  <option value="repeat-y">Répéter verticalement</option>
                </select>
              </div>
            </>
          )}
        </>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Forme du fond (Clip-path)
        </label>
        <select
          value={backgroundClipPath}
          onChange={(e) => onUpdate(['backgroundClipPath'], e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
        >
          {CLIP_PATHS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {backgroundClipPath && backgroundClipPath !== 'none' && (
          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs font-medium text-gray-600 mb-2">Aperçu :</p>
            <div className="flex justify-center">
              <div
                className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500"
                style={{ clipPath: backgroundClipPath }}
              />
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
