interface FontControlProps {
  font?: string;
  onUpdate: (path: string[], value: any) => void;
}

export function FontControl({ font, onUpdate }: FontControlProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        Police
      </label>
      <select
        value={font || 'paragraph'}
        onChange={(e) => onUpdate(['font'], e.target.value)}
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
      >
        <option value="title">Police des titres</option>
        <option value="paragraph">Police des paragraphes</option>
      </select>
    </div>
  );
}
