import { useState, useEffect } from 'react';
import { X, Download, Loader2, Calendar } from 'lucide-react';
import { usePresets } from '../../hooks/usePresets';
import type { SectionPreset } from '../../types/supabase';

interface LoadPresetDialogProps {
  sectionType: string;
  currentTemplateId: string;
  onLoad: (preset: SectionPreset) => void;
  onClose: () => void;
}

export function LoadPresetDialog({
  sectionType,
  currentTemplateId,
  onLoad,
  onClose,
}: LoadPresetDialogProps) {
  const { presets, loading, loadPresetsByTemplate } = usePresets();
  const [selectedPreset, setSelectedPreset] = useState<SectionPreset | null>(null);

  useEffect(() => {
    loadPresetsByTemplate(currentTemplateId);
  }, [currentTemplateId]);

  // Filtrer les presets par type de section
  const filteredPresets = presets.filter(p => p.sectionType === sectionType);

  const handleApply = () => {
    if (selectedPreset) {
      onLoad(selectedPreset);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Download size={20} className="text-[#1E90FF]" />
            <h2 className="text-lg font-semibold text-gray-900">Charger un preset</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-blue-50 border border-[#1E90FF] rounded-lg p-3 mb-4">
            <p className="text-xs text-[#1E90FF] font-medium">
              <span className="font-semibold">Type de section :</span> {sectionType}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#1E90FF]" />
            </div>
          ) : filteredPresets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun preset disponible</p>
              <p className="text-sm text-gray-400 mt-2">
                Créez votre premier preset pour ce type de section
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPreset?.id === preset.id
                      ? 'border-[#1E90FF] bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-[#1E90FF] hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{preset.name}</h3>
                      {preset.description && (
                        <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Créé le {formatDate(preset.createdAt)}
                        </span>
                      </div>
                    </div>
                    {selectedPreset?.id === preset.id && (
                      <div className="w-5 h-5 rounded-full bg-[#1E90FF] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedPreset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
