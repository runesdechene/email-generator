import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { GlobalStyleTemplate } from '../../types/firebase';

interface TemplateEditorProps {
  template: GlobalStyleTemplate;
  onSave: (updates: Partial<Omit<GlobalStyleTemplate, 'id' | 'createdAt'>>) => Promise<void>;
  onBack: () => void;
}

export function TemplateEditor({ template, onSave, onBack }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || '',
    fonts: template.fonts,
    colors: template.colors,
    buttonStyle: template.buttonStyle,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(formData);
      alert('Template mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
        >
          <ArrowLeft size={20} />
          Retour aux templates
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Édition du template</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configurez les styles pour "{template.name}"
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={18} />
                Sauvegarder
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Informations générales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                  rows={3}
                  placeholder="Description de votre template..."
                />
              </div>
            </div>
          </div>

          {/* Typographie */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typographie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police des titres
                </label>
                <input
                  type="text"
                  value={formData.fonts.title}
                  onChange={(e) => setFormData({ ...formData, fonts: { ...formData.fonts, title: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Arial, sans-serif"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police des paragraphes
                </label>
                <input
                  type="text"
                  value={formData.fonts.paragraph}
                  onChange={(e) => setFormData({ ...formData, fonts: { ...formData.fonts, paragraph: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Arial, sans-serif"
                />
              </div>
            </div>
          </div>

          {/* Couleurs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Palette de couleurs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur primaire
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, primary: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, primary: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur secondaire
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.secondary}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, secondary: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.secondary}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, secondary: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur d'accent
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.accent}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, accent: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.accent}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, accent: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur de fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.background}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, background: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.background}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, background: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur du texte
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.text}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, text: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.text}
                    onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, text: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Style des boutons */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Style des boutons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur de fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.buttonStyle.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, backgroundColor: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.buttonStyle.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, backgroundColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur au survol
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.buttonStyle.hoverBackgroundColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, hoverBackgroundColor: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.buttonStyle.hoverBackgroundColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, hoverBackgroundColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur du texte
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.buttonStyle.textColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, textColor: e.target.value } })}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.buttonStyle.textColor}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, textColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrondi des coins
                </label>
                <input
                  type="text"
                  value={formData.buttonStyle.borderRadius}
                  onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, borderRadius: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="8px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Padding
                </label>
                <input
                  type="text"
                  value={formData.buttonStyle.padding}
                  onChange={(e) => setFormData({ ...formData, buttonStyle: { ...formData.buttonStyle, padding: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="12px 24px"
                />
              </div>
            </div>

            {/* Aperçu du bouton */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Aperçu du bouton</p>
              <button
                style={{
                  backgroundColor: formData.buttonStyle.backgroundColor,
                  color: formData.buttonStyle.textColor,
                  borderRadius: formData.buttonStyle.borderRadius,
                  padding: formData.buttonStyle.padding,
                }}
                className="transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = formData.buttonStyle.hoverBackgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = formData.buttonStyle.backgroundColor}
              >
                Bouton exemple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
