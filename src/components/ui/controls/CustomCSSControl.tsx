interface CustomCSSControlProps {
  customCSS?: string;
  onUpdate: (path: string[], value: any) => void;
}

export function CustomCSSControl({ customCSS = '', onUpdate }: CustomCSSControlProps) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">CSS personnalisé</h3>
      <textarea
        value={customCSS}
        onChange={(e) => onUpdate(['customCSS'], e.target.value)}
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
        rows={8}
        placeholder=".img {\n  filter: invert();\n  border-radius: 8px;\n}\n\np {\n  color: #333;\n}"
      />
      <p className="text-xs text-gray-400 mt-1">CSS complet avec sélecteurs et accolades</p>
    </div>
  );
}
