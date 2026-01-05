import type { GlobalStyleTemplate } from '../../../types/supabase';

interface TagFontSizeControlProps {
  tagFontSizes?: {
    p?: number;
    h1?: number;
    h2?: number;
    h3?: number;
    h4?: number;
    h5?: number;
  };
  currentTemplate?: GlobalStyleTemplate;
  tagsToShow?: string[];
  onUpdate: (path: string[], value: any) => void;
}

export function TagFontSizeControl({ tagFontSizes = {}, currentTemplate, tagsToShow, onUpdate }: TagFontSizeControlProps) {
  const allTags = [
    { key: 'p', label: 'Paragraphe (P)' },
    { key: 'h1', label: 'Titre 1 (H1)' },
    { key: 'h2', label: 'Titre 2 (H2)' },
    { key: 'h3', label: 'Titre 3 (H3)' },
    { key: 'h4', label: 'Titre 4 (H4)' },
    { key: 'h5', label: 'Titre 5 (H5)' },
  ];

  const tags = tagsToShow 
    ? allTags.filter(tag => tagsToShow.includes(tag.key))
    : allTags;

  const handleChange = (tag: string, value: number | undefined) => {
    const newTagFontSizes = { ...tagFontSizes, [tag]: value };
    onUpdate(['tagFontSizes'], newTagFontSizes);
  };

  const getPlaceholder = (key: string) => {
    const templateSize = currentTemplate?.tagFontSizes?.[key as keyof typeof currentTemplate.tagFontSizes];
    return templateSize ? `${templateSize}px` : `${key === 'p' ? 16 : key === 'h1' ? 32 : key === 'h2' ? 24 : key === 'h3' ? 20 : key === 'h4' ? 18 : 16}px`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-700">
        Tailles de police par balise
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Personnalisez la taille de chaque balise HTML. Laissez vide pour utiliser la taille du template.
      </p>
      
      <div className="space-y-2">
        {tags.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-32 flex-shrink-0">
              {label}
            </label>
            <input
              type="number"
              min="8"
              max="72"
              value={tagFontSizes[key as keyof typeof tagFontSizes] ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                handleChange(key, value);
              }}
              placeholder={getPlaceholder(key)}
              className="w-20 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            />
            <span className="text-xs text-gray-500">px</span>
            {tagFontSizes[key as keyof typeof tagFontSizes] && (
              <button
                onClick={() => handleChange(key, undefined)}
                className="text-xs text-red-500 hover:text-red-700"
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
