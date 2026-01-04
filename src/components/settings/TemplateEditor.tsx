import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import type { GlobalStyleTemplate } from '../../types/firebase';
import { GOOGLE_FONTS, loadGoogleFont, getFontFamily } from '../../utils/googleFonts';
import './TemplateEditor.css';

interface TemplateEditorProps {
  template: GlobalStyleTemplate;
  onSave: (updates: Partial<Omit<GlobalStyleTemplate, 'id' | 'createdAt'>>) => Promise<void>;
  onBack: () => void;
}

export function TemplateEditor({ template, onSave, onBack }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || '',
    backgroundImage: template.backgroundImage || '',
    backgroundSize: template.backgroundSize || 'cover',
    fonts: template.fonts,
    colors: template.colors,
    buttonStyle: template.buttonStyle,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Charger les fonts Google sélectionnées
  useEffect(() => {
    if (formData.fonts.title) {
      loadGoogleFont(formData.fonts.title);
    }
    if (formData.fonts.paragraph) {
      loadGoogleFont(formData.fonts.paragraph);
    }
  }, [formData.fonts.title, formData.fonts.paragraph]);

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Données à sauvegarder:', formData);
      console.log('backgroundSize:', formData.backgroundSize);
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

          {/* Image de fond */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image de fond</h3>
            <div className="space-y-4">
              {/* Upload et aperçu côte à côte */}
              <div className="flex gap-4">
                {/* Colonne gauche : Upload */}
                <div className="flex-1 space-y-4">
                  {/* Upload de fichier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uploader une image
                    </label>
                    <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-400 transition-all">
                          <Upload size={18} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {uploading ? 'Upload en cours...' : 'Choisir une image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              setUploading(true);
                              const url = await SupabaseStorageService.uploadTemplateBackground(file, template.id);
                              setFormData({ ...formData, backgroundImage: url });
                            } catch (error) {
                              alert('Erreur lors de l\'upload de l\'image');
                            } finally {
                              setUploading(false);
                            }
                          }}
                        />
                      </label>
                      {formData.backgroundImage && (
                        <button
                          onClick={() => setFormData({ ...formData, backgroundImage: '' })}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center gap-2"
                          title="Supprimer l'image"
                        >
                          <X size={18} />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OU séparateur */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400">OU</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>

                  {/* URL manuelle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.backgroundImage}
                      onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="https://exemple.com/parchemin.jpg"
                    />
                  </div>

                  {/* Mode d'affichage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode d'affichage
                    </label>
                    <select
                      value={formData.backgroundSize}
                      onChange={(e) => setFormData({ ...formData, backgroundSize: e.target.value as 'cover' | 'repeat' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="cover">Cover (étire pour remplir)</option>
                      <option value="repeat">Répétition (100% auto)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      L'image sera affichée en arrière-plan de toutes les sections (repeat-y, {formData.backgroundSize === 'cover' ? 'contain' : '100% auto'})
                    </p>
                  </div>
                </div>

                {/* Colonne droite : Aperçu carré */}
                {formData.backgroundImage && (
                  <div className="w-48 h-48 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu</p>
                    <div 
                      className="w-full h-full rounded border border-gray-300"
                      style={{
                        backgroundImage: `url(${formData.backgroundImage})`,
                        backgroundRepeat: 'repeat-y',
                        backgroundSize: formData.backgroundSize === 'cover' ? 'cover' : '100% auto',
                        backgroundPosition: 'center top',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Typographie */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typographie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police des titres (Google Fonts & locales)
                </label>
                <input
                  type="text"
                  list="title-fonts"
                  value={formData.fonts.title}
                  onChange={(e) => setFormData({ ...formData, fonts: { ...formData.fonts, title: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Ex: Roboto, Arial, Helvetica..."
                  style={{ fontFamily: getFontFamily(formData.fonts.title) }}
                />
                <datalist id="title-fonts">
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font} value={font} />
                  ))}
                  <option value="Arial" />
                  <option value="Helvetica" />
                  <option value="Times New Roman" />
                  <option value="Georgia" />
                  <option value="Verdana" />
                  <option value="Courier New" />
                </datalist>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: getFontFamily(formData.fonts.title) }}>
                  Aperçu : The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police des paragraphes (Google Fonts & locales)
                </label>
                <input
                  type="text"
                  list="paragraph-fonts"
                  value={formData.fonts.paragraph}
                  onChange={(e) => setFormData({ ...formData, fonts: { ...formData.fonts, paragraph: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Ex: Open Sans, Arial, Verdana..."
                  style={{ fontFamily: getFontFamily(formData.fonts.paragraph) }}
                />
                <datalist id="paragraph-fonts">
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font} value={font} />
                  ))}
                  <option value="Arial" />
                  <option value="Helvetica" />
                  <option value="Times New Roman" />
                  <option value="Georgia" />
                  <option value="Verdana" />
                  <option value="Courier New" />
                </datalist>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: getFontFamily(formData.fonts.paragraph) }}>
                  Aperçu : The quick brown fox jumps over the lazy dog
                </p>
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
