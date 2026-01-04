interface PaddingControlProps {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  useTemplatePaddingInline?: boolean;
  useTemplatePaddingBlock?: boolean;
  onUpdate: (path: string[], value: any) => void;
}

export function PaddingControl({
  paddingTop = 32,
  paddingBottom = 32,
  paddingLeft = 32,
  paddingRight = 32,
  useTemplatePaddingInline = true,
  useTemplatePaddingBlock = true,
  onUpdate,
}: PaddingControlProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        Padding
      </label>
      
      {/* Toggles pour utiliser les paddings du template */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onUpdate(['useTemplatePaddingInline'], !useTemplatePaddingInline)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-all ${
            useTemplatePaddingInline
              ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
          }`}
          title="Utiliser le padding inline du template (gauche/droite)"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m10 8V8M5 12h14" />
          </svg>
          Inline
        </button>
        <button
          onClick={() => onUpdate(['useTemplatePaddingBlock'], !useTemplatePaddingBlock)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-all ${
            useTemplatePaddingBlock
              ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
          }`}
          title="Utiliser le padding block du template (haut/bas)"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5m8 2V5M12 5v14m-4 2h8M7 12h10" />
          </svg>
          Block
        </button>
      </div>

      {/* Paddings 4 directions */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Haut</label>
          <input
            type="number"
            value={paddingTop}
            onChange={(e) => onUpdate(['paddingTop'], parseInt(e.target.value) || 0)}
            disabled={useTemplatePaddingBlock}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bas</label>
          <input
            type="number"
            value={paddingBottom}
            onChange={(e) => onUpdate(['paddingBottom'], parseInt(e.target.value) || 0)}
            disabled={useTemplatePaddingBlock}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Gauche</label>
          <input
            type="number"
            value={paddingLeft}
            onChange={(e) => onUpdate(['paddingLeft'], parseInt(e.target.value) || 0)}
            disabled={useTemplatePaddingInline}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Droite</label>
          <input
            type="number"
            value={paddingRight}
            onChange={(e) => onUpdate(['paddingRight'], parseInt(e.target.value) || 0)}
            disabled={useTemplatePaddingInline}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
