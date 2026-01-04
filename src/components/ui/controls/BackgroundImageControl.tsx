import { ImagePicker } from '../ImagePicker';

interface BackgroundImageControlProps {
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  sectionId: string;
  onUpdate: (path: string[], value: any) => void;
}

export function BackgroundImageControl({
  backgroundImageUrl = '',
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
  sectionId,
  onUpdate,
}: BackgroundImageControlProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-xs font-semibold text-gray-700 mb-3">Image de fond</h3>
      
      <ImagePicker
        value={backgroundImageUrl}
        onChange={(url) => onUpdate(['backgroundImageUrl'], url)}
        sectionId={sectionId}
        label="Image de fond de la section"
      />

      {backgroundImageUrl && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Taille de l'image
            </label>
            <select
              value={backgroundSize}
              onChange={(e) => onUpdate(['backgroundSize'], e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            >
              <option value="cover">Cover (remplir)</option>
              <option value="contain">Contain (contenir)</option>
              <option value="auto">Auto (taille originale)</option>
              <option value="100% 100%">Stretch (étirer)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'top left', label: '↖' },
                { value: 'top center', label: '↑' },
                { value: 'top right', label: '↗' },
                { value: 'center left', label: '←' },
                { value: 'center', label: '●' },
                { value: 'center right', label: '→' },
                { value: 'bottom left', label: '↙' },
                { value: 'bottom center', label: '↓' },
                { value: 'bottom right', label: '↘' },
              ].map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => onUpdate(['backgroundPosition'], pos.value)}
                  className={`px-3 py-2 text-lg rounded border transition-all ${
                    backgroundPosition === pos.value
                      ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                  }`}
                  title={pos.value}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Répétition
            </label>
            <select
              value={backgroundRepeat}
              onChange={(e) => onUpdate(['backgroundRepeat'], e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            >
              <option value="no-repeat">Pas de répétition</option>
              <option value="repeat">Répéter</option>
              <option value="repeat-x">Répéter horizontalement</option>
              <option value="repeat-y">Répéter verticalement</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
