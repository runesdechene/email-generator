import type { GlobalStyleTemplate } from '../../../types/supabase';

interface TagColorControlProps {
  tagColors?: {
    p?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
  };
  currentTemplate?: GlobalStyleTemplate;
  onUpdate: (path: string[], value: any) => void;
}

export function TagColorControl({ tagColors = {}, currentTemplate, onUpdate }: TagColorControlProps) {
  const tags = [
    { key: 'p', label: 'Paragraphe (P)' },
    { key: 'h1', label: 'Titre 1 (H1)' },
    { key: 'h2', label: 'Titre 2 (H2)' },
    { key: 'h3', label: 'Titre 3 (H3)' },
    { key: 'h4', label: 'Titre 4 (H4)' },
    { key: 'h5', label: 'Titre 5 (H5)' },
  ];

  const handleChange = (tag: string, value: string | undefined) => {
    const newTagColors = { ...tagColors, [tag]: value };
    onUpdate(['tagColors'], newTagColors);
  };

  const getPlaceholder = (key: string) => {
    const templateColor = currentTemplate?.tagColors?.[key as keyof typeof currentTemplate.tagColors];
    return templateColor || '#000000';
  };

  const getColorValue = (key: string) => {
    const value = tagColors[key as keyof typeof tagColors];
    return value || getPlaceholder(key);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-700">
        Couleurs par balise
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Personnalisez la couleur de chaque balise HTML. Laissez vide pour utiliser la couleur du template.
      </p>
      
      <div className="space-y-2">
        {tags.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <label className="text-xs text-gray-600 w-28 flex-shrink-0">
              {label}
            </label>
            <input
              type="color"
              value={getColorValue(key)}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={tagColors[key as keyof typeof tagColors] || ''}
              onChange={(e) => handleChange(key, e.target.value || undefined)}
              placeholder={getPlaceholder(key)}
              className="flex-1 min-w-0 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            />
            {tagColors[key as keyof typeof tagColors] && (
              <button
                onClick={() => handleChange(key, undefined)}
                className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
                title="Réinitialiser"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
