import { X } from 'lucide-react';
import type { SectionTemplate } from '../../types/firebase';

interface TemplateSelectorPanelProps {
  sectionTypes: SectionTemplate[];
  onSelectSectionType: (sectionType: SectionTemplate) => void;
  onClose: () => void;
}

export function TemplateSelectorPanel({ sectionTypes, onSelectSectionType, onClose }: TemplateSelectorPanelProps) {
  return (
    <aside className="w-80 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Ajouter une section</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-xs text-gray-500 mb-4">
          Sélectionnez un type de section à ajouter à votre email
        </p>

        <div className="grid grid-cols-2 gap-3">
          {sectionTypes.map((sectionType) => (
            <button
              key={sectionType.id}
              onClick={() => onSelectSectionType(sectionType)}
              className="group relative aspect-square rounded-lg border-2 border-gray-200 hover:border-violet-500 transition-all overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:from-violet-50 hover:to-violet-100"
            >
              {sectionType.thumbnail ? (
                <img
                  src={sectionType.thumbnail}
                  alt={sectionType.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center mb-2 transition-colors">
                    <span className="text-2xl font-bold text-violet-600">
                      {sectionType.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                    {sectionType.name}
                  </p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white">
                  <p className="text-xs font-semibold">{sectionType.name}</p>
                  {sectionType.description && (
                    <p className="text-xs opacity-90 line-clamp-2 mt-1">
                      {sectionType.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {sectionTypes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Aucun type de section disponible</p>
            <p className="text-gray-400 text-xs mt-1">
              Créez des types de sections dans Supabase
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
