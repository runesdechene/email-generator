interface TagTypeControlProps {
  tagType?: string;
  onUpdate: (path: string[], value: any) => void;
}

export function TagTypeControl({ tagType = 'h2', onUpdate }: TagTypeControlProps) {
  const tagTypes = [
    { value: 'h1', label: 'Titre 1 (H1)' },
    { value: 'h2', label: 'Titre 2 (H2)' },
    { value: 'h3', label: 'Titre 3 (H3)' },
    { value: 'h4', label: 'Titre 4 (H4)' },
    { value: 'h5', label: 'Titre 5 (H5)' },
    { value: 'h6', label: 'Titre 6 (H6)' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">
        Type de balise
      </label>
      <select
        value={tagType}
        onChange={(e) => onUpdate(['tagType'], e.target.value)}
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
      >
        {tagTypes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">Choisissez le type de titre à utiliser</p>
    </div>
  );
}
