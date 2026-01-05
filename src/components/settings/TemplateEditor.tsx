import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import { useToast } from '../../hooks/useToast';
import type { GlobalStyleTemplate } from '../../types/supabase';
import { GOOGLE_FONTS, loadGoogleFont, getFontFamily } from '../../utils/googleFonts';
import './TemplateEditor.css';

interface TemplateEditorProps {
  template: GlobalStyleTemplate;
  onSave: (updates: Partial<Omit<GlobalStyleTemplate, 'id' | 'createdAt'>>) => Promise<void>;
  onBack: () => void;
}

export function TemplateEditor({ template, onSave, onBack }: TemplateEditorProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || '',
    backgroundImage: template.backgroundImage || '',
    backgroundSize: template.backgroundSize || 'cover',
    fonts: template.fonts,
    colors: template.colors,
    customColors: template.customColors || [],
    fontSizes: template.fontSizes,
    tagFontSizes: template.tagFontSizes || { p: 16, h1: 32, h2: 24, h3: 20, h4: 18, h5: 16 },
    tagColors: template.tagColors || { p: '', h1: '', h2: '', h3: '', h4: '', h5: '' },
    paddingInline: template.paddingInline,
    paddingBlock: template.paddingBlock,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');

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
      toast.success('Template mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde');
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
            className="flex items-center gap-2 px-4 py-2 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] resize-none"
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
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1E90FF] transition-all">
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
                              toast.error('Erreur lors de l\'upload de l\'image');
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono text-sm"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur accent
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Couleurs personnalisées */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Couleurs personnalisées</h3>
            <p className="text-sm text-gray-600 mb-4">Ajoutez des couleurs personnalisées avec un nom pour les réutiliser dans vos sections.</p>
            
            {/* Liste des couleurs personnalisées */}
            <div className="space-y-2 mb-4">
              {formData.customColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-10 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{color.value}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newColors = formData.customColors.filter((_, i) => i !== index);
                      setFormData({ ...formData, customColors: newColors });
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Ajouter une nouvelle couleur */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Ajouter une couleur</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Ex: Brand Blue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Couleur</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newColorValue}
                      onChange={(e) => setNewColorValue(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColorValue}
                      onChange={(e) => setNewColorValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (newColorName.trim()) {
                    setFormData({
                      ...formData,
                      customColors: [...formData.customColors, { name: newColorName, value: newColorValue }]
                    });
                    setNewColorName('');
                    setNewColorValue('#000000');
                  }
                }}
                className="w-full px-4 py-2 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-colors text-sm font-medium"
              >
                Ajouter la couleur
              </button>
            </div>
          </div>

          {/* Paddings du template */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paddings par défaut</h3>
            <p className="text-sm text-gray-600 mb-4">Définissez les paddings par défaut pour vos sections.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Padding Inline (gauche/droite)</label>
                <input
                  type="number"
                  value={formData.paddingInline}
                  onChange={(e) => setFormData({ ...formData, paddingInline: parseInt(e.target.value) || 32 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  min="0"
                  max="200"
                />
                <p className="text-xs text-gray-500 mt-1">En pixels</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Padding Block (haut/bas)</label>
                <input
                  type="number"
                  value={formData.paddingBlock}
                  onChange={(e) => setFormData({ ...formData, paddingBlock: parseInt(e.target.value) || 32 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  min="0"
                  max="200"
                />
                <p className="text-xs text-gray-500 mt-1">En pixels</p>
              </div>
            </div>
          </div>

          {/* Tailles de police par balise */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tailles de police par balise</h3>
            <p className="text-sm text-gray-600 mb-4">Définissez les tailles de police par défaut pour chaque balise HTML.</p>
            <div className="space-y-3">
              {[
                { key: 'p', label: 'Paragraphe (P)', defaultSize: 16 },
                { key: 'h1', label: 'Titre 1 (H1)', defaultSize: 32 },
                { key: 'h2', label: 'Titre 2 (H2)', defaultSize: 24 },
                { key: 'h3', label: 'Titre 3 (H3)', defaultSize: 20 },
                { key: 'h4', label: 'Titre 4 (H4)', defaultSize: 18 },
                { key: 'h5', label: 'Titre 5 (H5)', defaultSize: 16 },
              ].map(({ key, label, defaultSize }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={formData.tagFontSizes[key as keyof typeof formData.tagFontSizes]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tagFontSizes: { 
                        ...formData.tagFontSizes, 
                        [key]: parseInt(e.target.value) || defaultSize 
                      } 
                    })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                    min="8"
                    max="72"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Couleurs par balise */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Couleurs par balise</h3>
            <p className="text-sm text-gray-600 mb-4">Définissez les couleurs par défaut pour chaque balise HTML.</p>
            <div className="space-y-3">
              {[
                { key: 'p', label: 'Paragraphe (P)' },
                { key: 'h1', label: 'Titre 1 (H1)' },
                { key: 'h2', label: 'Titre 2 (H2)' },
                { key: 'h3', label: 'Titre 3 (H3)' },
                { key: 'h4', label: 'Titre 4 (H4)' },
                { key: 'h5', label: 'Titre 5 (H5)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                    {label}
                  </label>
                  <input
                    type="color"
                    value={formData.tagColors[key as keyof typeof formData.tagColors] || '#000000'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tagColors: { 
                        ...formData.tagColors, 
                        [key]: e.target.value 
                      } 
                    })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.tagColors[key as keyof typeof formData.tagColors] || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tagColors: { 
                        ...formData.tagColors, 
                        [key]: e.target.value 
                      } 
                    })}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

