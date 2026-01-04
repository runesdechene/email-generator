import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useTemplates } from '../../hooks/useSupabase';

interface SavePresetDialogProps {
  sectionType: string;
  sectionContent: Record<string, unknown>;
  currentTemplateId: string;
  onSave: (name: string, description: string, templateIds: string[]) => Promise<void>;
  onClose: () => void;
}

export function SavePresetDialog({
  sectionType,
  currentTemplateId,
  onSave,
  onClose,
}: SavePresetDialogProps) {
  const { templates } = useTemplates();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set([currentTemplateId]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleTemplate = (templateId: string) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId);
    } else {
      newSelected.add(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Le nom du preset est requis');
      return;
    }

    if (selectedTemplates.size === 0) {
      setError('Sélectionnez au moins un template');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(name, description, Array.from(selectedTemplates));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Save size={20} className="text-[#1E90FF]" />
            <h2 className="text-lg font-semibold text-gray-900">Sauvegarder comme preset</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-[#1E90FF] rounded-lg p-3">
            <p className="text-xs text-[#1E90FF] font-medium">
              <span className="font-semibold">Type de section :</span> {sectionType}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du preset *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
              placeholder="Ex: Titre principal bleu"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] resize-none"
              rows={3}
              placeholder="Décrivez ce preset..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Templates associés * (minimum 1)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Ce preset sera disponible dans les templates sélectionnés
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {templates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun template disponible
                </p>
              ) : (
                templates.map((template) => (
                  <label
                    key={template.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTemplates.has(template.id)}
                      onChange={() => handleToggleTemplate(template.id)}
                      className="w-4 h-4 text-[#1E90FF] border-gray-300 rounded focus:ring-[#1E90FF]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{template.name}</p>
                      {template.description && (
                        <p className="text-xs text-gray-500">{template.description}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
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
            onClick={handleSave}
            disabled={saving || !name.trim() || selectedTemplates.size === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
