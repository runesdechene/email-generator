import { useState } from 'react';
import { Download, Loader2, X, LayoutGrid, Save } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { useTemplates, useSectionTemplates } from '../../hooks/useSupabase';
import { usePresets } from '../../hooks/usePresets';
import { exportSectionWithBackground } from '../../utils/exportWithBackground';
import { useToast } from '../../hooks/useToast';
import { SavePresetDialog } from '../presets/SavePresetDialog';
import { LoadPresetDialog } from '../presets/LoadPresetDialog';
import { ImagePicker } from '../ui/ImagePicker';
import { AccordionSection } from '../ui/AccordionSection';
import { 
  PaddingControl, 
  TagFontSizeControl,
  TagColorControl,
  TagTypeControl,
  ColorControl, 
  TextStyleControl, 
  CustomCSSControl,
  BackgroundImageControl,
  DividerControl,
  OverlayControl,
  ShapeControl
} from '../ui/controls';
import type { SectionPreset } from '../../types/supabase';

interface OptionsPanelProps {
  sectionsRef: React.RefObject<Map<string, HTMLDivElement>>;
}

export function OptionsPanel({ sectionsRef }: OptionsPanelProps) {
  const { selectedSectionId, sections, currentTemplateId, selectSection, updateSection } = useEmailStore();
  const { templates } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();
  const { createPreset } = usePresets();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false);
  const [showLoadPresetDialog, setShowLoadPresetDialog] = useState(false);
  
  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const sectionType = sectionTemplates.find(t => t.id === selectedSection?.templateId);

  if (!selectedSection) {
    return null;
  }

  const updateContent = (field: string, value: any) => {
    updateSection(selectedSection.id, {
      content: {
        ...selectedSection.content,
        [field]: value,
      },
    });
  };

  const updateOption = (path: string[], value: any) => {
    // Copie profonde des options pour éviter les mutations
    const options = JSON.parse(JSON.stringify((selectedSection.content.options as any) || {}));
    let current = options;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    
    updateSection(selectedSection.id, {
      content: {
        ...selectedSection.content,
        options,
      },
    });
  };

  const handleSavePreset = async (name: string, description: string, templateIds: string[]) => {
    if (!sectionType) return;

    try {
      await createPreset({
        user_id: '', // Sera remplacé automatiquement par le hook
        name,
        description,
        sectionType: sectionType.name,
        content: selectedSection.content,
        templateIds,
      });
      toast.success('Preset sauvegardé avec succès !');
    } catch (error) {
      console.error('Error saving preset:', error);
      toast.error('Erreur lors de la sauvegarde du preset');
    }
  };

  const handleLoadPreset = (preset: SectionPreset) => {
    // Appliquer le contenu du preset à la section actuelle
    updateSection(selectedSection.id, {
      content: preset.content,
    });
    toast.success(`Preset "${preset.name}" appliqué avec succès !`);
  };

  return (
    <aside className="w-100 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Options de la section</h2>
          {sectionType && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-[#1E90FF] rounded text-xs text-[#1E90FF] font-medium">
              <LayoutGrid size={12} />
              <span>{sectionType.name}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => selectSection(null)}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Nom de la section
          </label>
          <input
            type="text"
            value={selectedSection.name}
            onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          />
        </div>

        {/* Sélecteur de preset */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-500">
              Preset de section
            </label>
            <button
              onClick={() => setShowSavePresetDialog(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[#1E90FF] hover:bg-blue-50 rounded transition-all"
              title="Sauvegarder comme preset"
            >
              <Save size={12} />
              <span>Sauvegarder</span>
            </button>
          </div>
          <button
            onClick={() => setShowLoadPresetDialog(true)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-[#1E90FF] hover:bg-blue-50 transition-all text-left"
          >
            Charger un preset...
          </button>
        </div>

        {sectionType?.name === 'Texte HTML' && (
          <>
            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
                rows={6}
                placeholder="<p>Votre contenu HTML ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </AccordionSection>

            <AccordionSection title="Image de fond">
              <BackgroundImageControl
                backgroundImageUrl={(selectedSection.content.options as any)?.backgroundImageUrl}
                backgroundSize={(selectedSection.content.options as any)?.backgroundSize}
                backgroundPosition={(selectedSection.content.options as any)?.backgroundPosition}
                backgroundRepeat={(selectedSection.content.options as any)?.backgroundRepeat}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Diviseurs">
              <DividerControl
                topDividerEnabled={(selectedSection.content.options as any)?.topDividerEnabled}
                topDividerType={(selectedSection.content.options as any)?.topDividerType}
                topDividerImageUrl={(selectedSection.content.options as any)?.topDividerImageUrl}
                topDividerSvgType={(selectedSection.content.options as any)?.topDividerSvgType}
                topDividerColor={(selectedSection.content.options as any)?.topDividerColor}
                topDividerHeight={(selectedSection.content.options as any)?.topDividerHeight}
                topDividerFlip={(selectedSection.content.options as any)?.topDividerFlip}
                bottomDividerEnabled={(selectedSection.content.options as any)?.bottomDividerEnabled}
                bottomDividerType={(selectedSection.content.options as any)?.bottomDividerType}
                bottomDividerImageUrl={(selectedSection.content.options as any)?.bottomDividerImageUrl}
                bottomDividerSvgType={(selectedSection.content.options as any)?.bottomDividerSvgType}
                bottomDividerColor={(selectedSection.content.options as any)?.bottomDividerColor}
                bottomDividerHeight={(selectedSection.content.options as any)?.bottomDividerHeight}
                bottomDividerFlip={(selectedSection.content.options as any)?.bottomDividerFlip}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'Texte' && (
          <>
            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                rows={6}
                placeholder="Votre texte ici..."
              />
              <p className="text-xs text-gray-400 mt-1">Texte simple (pas de HTML)</p>
            </AccordionSection>

            <AccordionSection title="Image de fond">
              <BackgroundImageControl
                backgroundImageUrl={(selectedSection.content.options as any)?.backgroundImageUrl}
                backgroundSize={(selectedSection.content.options as any)?.backgroundSize}
                backgroundPosition={(selectedSection.content.options as any)?.backgroundPosition}
                backgroundRepeat={(selectedSection.content.options as any)?.backgroundRepeat}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                tagsToShow={['p']}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                tagsToShow={['p']}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Diviseurs">
              <DividerControl
                topDividerEnabled={(selectedSection.content.options as any)?.topDividerEnabled}
                topDividerType={(selectedSection.content.options as any)?.topDividerType}
                topDividerImageUrl={(selectedSection.content.options as any)?.topDividerImageUrl}
                topDividerSvgType={(selectedSection.content.options as any)?.topDividerSvgType}
                topDividerColor={(selectedSection.content.options as any)?.topDividerColor}
                topDividerHeight={(selectedSection.content.options as any)?.topDividerHeight}
                topDividerFlip={(selectedSection.content.options as any)?.topDividerFlip}
                bottomDividerEnabled={(selectedSection.content.options as any)?.bottomDividerEnabled}
                bottomDividerType={(selectedSection.content.options as any)?.bottomDividerType}
                bottomDividerImageUrl={(selectedSection.content.options as any)?.bottomDividerImageUrl}
                bottomDividerSvgType={(selectedSection.content.options as any)?.bottomDividerSvgType}
                bottomDividerColor={(selectedSection.content.options as any)?.bottomDividerColor}
                bottomDividerHeight={(selectedSection.content.options as any)?.bottomDividerHeight}
                bottomDividerFlip={(selectedSection.content.options as any)?.bottomDividerFlip}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'Titre' && (
          <>
            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                rows={3}
                placeholder="Votre titre ici..."
              />
              <p className="text-xs text-gray-400 mt-1">Texte simple (pas de HTML)</p>
            </AccordionSection>

            <AccordionSection title="Type de balise">
              <TagTypeControl
                tagType={(selectedSection.content.options as any)?.tagType}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Image de fond">
              <BackgroundImageControl
                backgroundImageUrl={(selectedSection.content.options as any)?.backgroundImageUrl}
                backgroundSize={(selectedSection.content.options as any)?.backgroundSize}
                backgroundPosition={(selectedSection.content.options as any)?.backgroundPosition}
                backgroundRepeat={(selectedSection.content.options as any)?.backgroundRepeat}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                tagsToShow={[(selectedSection.content.options as any)?.tagType || 'h2']}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                tagsToShow={[(selectedSection.content.options as any)?.tagType || 'h2']}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Diviseurs">
              <DividerControl
                topDividerEnabled={(selectedSection.content.options as any)?.topDividerEnabled}
                topDividerType={(selectedSection.content.options as any)?.topDividerType}
                topDividerImageUrl={(selectedSection.content.options as any)?.topDividerImageUrl}
                topDividerSvgType={(selectedSection.content.options as any)?.topDividerSvgType}
                topDividerColor={(selectedSection.content.options as any)?.topDividerColor}
                topDividerHeight={(selectedSection.content.options as any)?.topDividerHeight}
                topDividerFlip={(selectedSection.content.options as any)?.topDividerFlip}
                bottomDividerEnabled={(selectedSection.content.options as any)?.bottomDividerEnabled}
                bottomDividerType={(selectedSection.content.options as any)?.bottomDividerType}
                bottomDividerImageUrl={(selectedSection.content.options as any)?.bottomDividerImageUrl}
                bottomDividerSvgType={(selectedSection.content.options as any)?.bottomDividerSvgType}
                bottomDividerColor={(selectedSection.content.options as any)?.bottomDividerColor}
                bottomDividerHeight={(selectedSection.content.options as any)?.bottomDividerHeight}
                bottomDividerFlip={(selectedSection.content.options as any)?.bottomDividerFlip}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'HTML + Image' && (
          <>
            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
                rows={6}
                placeholder="<h2>Titre</h2><p>Votre contenu HTML ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </AccordionSection>

            <AccordionSection title="Image">
              <ImagePicker
                value={(selectedSection.content.options as any)?.imageUrl || ''}
                onChange={(url) => updateOption(['imageUrl'], url)}
                sectionId={selectedSection.id}
                label="Image de la section"
              />
              {(selectedSection.content.options as any)?.imageUrl && (
                <>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Position de l'image
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOption(['imagePosition'], 'left')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                          (selectedSection.content.options as any)?.imagePosition === 'left'
                            ? 'bg-[#1E90FF] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Gauche
                      </button>
                      <button
                        onClick={() => updateOption(['imagePosition'], 'right')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                          (selectedSection.content.options as any)?.imagePosition === 'right' || !(selectedSection.content.options as any)?.imagePosition
                            ? 'bg-[#1E90FF] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Droite
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Largeur de l'image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={(selectedSection.content.options as any)?.imageWidth ?? 50}
                        onChange={(e) => updateOption(['imageWidth'], parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="20"
                          max="80"
                          value={(selectedSection.content.options as any)?.imageWidth ?? 50}
                          onChange={(e) => updateOption(['imageWidth'], parseInt(e.target.value) || 50)}
                          className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                        />
                        <span className="text-xs text-gray-500">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Largeur de l'image (20% à 80%)</p>
                  </div>
                </>
              )}
            </AccordionSection>

            <AccordionSection title="Forme de l'image">
              <ShapeControl
                value={(selectedSection.content.options as any)?.clipPath || 'none'}
                onChange={(value) => updateOption(['clipPath'], value)}
                label="Forme de l'image (Clip-path)"
              />
            </AccordionSection>

            <AccordionSection title="Image de fond">
              <BackgroundImageControl
                backgroundImageUrl={(selectedSection.content.options as any)?.backgroundImageUrl}
                backgroundSize={(selectedSection.content.options as any)?.backgroundSize}
                backgroundPosition={(selectedSection.content.options as any)?.backgroundPosition}
                backgroundRepeat={(selectedSection.content.options as any)?.backgroundRepeat}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'Hero' && (
          <>
            <AccordionSection title="Image Hero" defaultOpen={true}>
              <ImagePicker
                value={(selectedSection.content.options as any)?.imageUrl || ''}
                onChange={(url) => updateOption(['imageUrl'], url)}
                sectionId={selectedSection.id}
                label="Image Hero"
              />
              {(selectedSection.content.options as any)?.imageUrl && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Taille de l'image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={(selectedSection.content.options as any)?.imageSize ?? 80}
                      onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="20"
                        max="100"
                        value={(selectedSection.content.options as any)?.imageSize ?? 80}
                        onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value) || 80)}
                        className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Largeur de l'image (20% à 100%)</p>
                </div>
              )}
            </AccordionSection>

            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
                rows={6}
                placeholder="<h1>Titre principal</h1><p>Votre texte ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </AccordionSection>

            <AccordionSection title="Image de fond">
              <BackgroundImageControl
                backgroundImageUrl={(selectedSection.content.options as any)?.backgroundImageUrl}
                backgroundSize={(selectedSection.content.options as any)?.backgroundSize}
                backgroundPosition={(selectedSection.content.options as any)?.backgroundPosition}
                backgroundRepeat={(selectedSection.content.options as any)?.backgroundRepeat}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Overlay">
              <OverlayControl
                value={(selectedSection.content.options as any)?.overlay || {}}
                onChange={(value) => updateOption(['overlay'], value)}
                label="Overlay sur l'image de fond"
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Diviseurs">
              <DividerControl
                topDividerEnabled={(selectedSection.content.options as any)?.topDividerEnabled}
                topDividerType={(selectedSection.content.options as any)?.topDividerType}
                topDividerImageUrl={(selectedSection.content.options as any)?.topDividerImageUrl}
                topDividerSvgType={(selectedSection.content.options as any)?.topDividerSvgType}
                topDividerColor={(selectedSection.content.options as any)?.topDividerColor}
                topDividerHeight={(selectedSection.content.options as any)?.topDividerHeight}
                topDividerFlip={(selectedSection.content.options as any)?.topDividerFlip}
                bottomDividerEnabled={(selectedSection.content.options as any)?.bottomDividerEnabled}
                bottomDividerType={(selectedSection.content.options as any)?.bottomDividerType}
                bottomDividerImageUrl={(selectedSection.content.options as any)?.bottomDividerImageUrl}
                bottomDividerSvgType={(selectedSection.content.options as any)?.bottomDividerSvgType}
                bottomDividerColor={(selectedSection.content.options as any)?.bottomDividerColor}
                bottomDividerHeight={(selectedSection.content.options as any)?.bottomDividerHeight}
                bottomDividerFlip={(selectedSection.content.options as any)?.bottomDividerFlip}
                sectionId={selectedSection.id}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'Image' && (
          <>
            <AccordionSection title="Image" defaultOpen={true}>
              <ImagePicker
                value={(selectedSection.content.options as any)?.imageUrl || ''}
                onChange={(url) => updateOption(['imageUrl'], url)}
                sectionId={selectedSection.id}
                label="Image de la section"
              />
              {(selectedSection.content.options as any)?.imageUrl && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Taille de l'image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={(selectedSection.content.options as any)?.imageSize ?? 100}
                      onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="20"
                        max="100"
                        value={(selectedSection.content.options as any)?.imageSize ?? 100}
                        onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value) || 100)}
                        className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Largeur de l'image (20% à 100%)</p>
                </div>
              )}
            </AccordionSection>

            <AccordionSection title="Forme">
              <ShapeControl
                value={(selectedSection.content.options as any)?.clipPath || 'none'}
                onChange={(value) => updateOption(['clipPath'], value)}
                label="Forme de l'image (Clip-path)"
              />
            </AccordionSection>

            <AccordionSection title="Overlay">
              <OverlayControl
                value={(selectedSection.content.options as any)?.overlay || {}}
                onChange={(value) => updateOption(['overlay'], value)}
                label="Overlay sur l'image"
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}

        {sectionType?.name === 'Image + Texte' && (
          <>
            <AccordionSection title="Contenu" defaultOpen={true}>
              <textarea
                value={(selectedSection.content.content as string) || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-mono"
                rows={6}
                placeholder="<h1>Titre</h1><p>Votre texte ici...</p>"
              />
              <p className="text-xs text-gray-400 mt-1">Supporte le HTML</p>
            </AccordionSection>

            <AccordionSection title="Image" defaultOpen={true}>
              <ImagePicker
                value={(selectedSection.content.options as any)?.imageUrl || ''}
                onChange={(url) => updateOption(['imageUrl'], url)}
                sectionId={selectedSection.id}
                label="Image de la section"
              />
              {(selectedSection.content.options as any)?.imageUrl && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Taille de l'image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={(selectedSection.content.options as any)?.imageSize ?? 100}
                      onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="20"
                        max="100"
                        value={(selectedSection.content.options as any)?.imageSize ?? 100}
                        onChange={(e) => updateOption(['imageSize'], parseInt(e.target.value) || 100)}
                        className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Largeur de l'image (20% à 100%)</p>
                </div>
              )}
            </AccordionSection>

            <AccordionSection title="Forme">
              <ShapeControl
                value={(selectedSection.content.options as any)?.clipPath || 'none'}
                onChange={(value) => updateOption(['clipPath'], value)}
                label="Forme de l'image (Clip-path)"
              />
            </AccordionSection>

            <AccordionSection title="Overlay">
              <OverlayControl
                value={(selectedSection.content.options as any)?.overlay || {}}
                onChange={(value) => updateOption(['overlay'], value)}
                label="Overlay sur l'image"
              />
            </AccordionSection>

            <AccordionSection title="Taille de police">
              <TagFontSizeControl
                tagFontSizes={(selectedSection.content.options as any)?.tagFontSizes}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Couleur">
              <TagColorControl
                tagColors={(selectedSection.content.options as any)?.tagColors}
                currentTemplate={templates.find(t => t.id === currentTemplateId)}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Style de texte">
              <TextStyleControl
                align={(selectedSection.content.options as any)?.textStyle?.align}
                bold={(selectedSection.content.options as any)?.textStyle?.bold}
                italic={(selectedSection.content.options as any)?.textStyle?.italic}
                underline={(selectedSection.content.options as any)?.textStyle?.underline}
                lineHeight={(selectedSection.content.options as any)?.textStyle?.lineHeight}
                letterSpacing={(selectedSection.content.options as any)?.textStyle?.letterSpacing}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="Padding">
              <PaddingControl
                paddingTop={(selectedSection.content.options as any)?.paddingTop}
                paddingBottom={(selectedSection.content.options as any)?.paddingBottom}
                paddingLeft={(selectedSection.content.options as any)?.paddingLeft}
                paddingRight={(selectedSection.content.options as any)?.paddingRight}
                useTemplatePaddingInline={(selectedSection.content.options as any)?.useTemplatePaddingInline}
                useTemplatePaddingBlock={(selectedSection.content.options as any)?.useTemplatePaddingBlock}
                onUpdate={updateOption}
              />
            </AccordionSection>

            <AccordionSection title="CSS personnalisé">
              <CustomCSSControl
                customCSS={(selectedSection.content.options as any)?.customCSS}
                onUpdate={updateOption}
              />
            </AccordionSection>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={async () => {
            if (!selectedSection) return;
            
            const element = sectionsRef.current?.get(selectedSection.id);
            if (!element) {
              toast.error('Impossible de trouver la section à exporter');
              return;
            }

            try {
              setExporting(true);
              
              // Sauvegarder l'ID de la section sélectionnée
              const currentSelectedId = selectedSection.id;
              
              // Désélectionner temporairement pour retirer la bordure violette
              selectSection(null);
              
              // Attendre que le DOM se mette à jour (retrait de la bordure)
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const currentTemplate = templates.find(t => t.id === currentTemplateId);
              const backgroundImageUrl = currentTemplate?.backgroundImage;
              const backgroundSize = currentTemplate?.backgroundSize || 'cover';
              
              const fileName = `${selectedSection.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-section-${selectedSection.order + 1}.jpg`;
              
              await exportSectionWithBackground({
                element,
                backgroundImageUrl,
                backgroundSize,
                fileName,
              });
              
              // Resélectionner la section après l'export
              selectSection(currentSelectedId);
              
              toast.success('Section exportée avec succès !');
            } catch (error) {
              console.error('Erreur export section:', error);
              toast.error('Erreur lors de l\'export de la section');
              // Resélectionner la section même en cas d'erreur
              if (selectedSection) {
                selectSection(selectedSection.id);
              }
            } finally {
              setExporting(false);
            }
          }}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E90FF] text-white rounded-lg shadow-md hover:bg-[#0066CC] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait text-sm font-medium"
        >
          {exporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download size={16} />
              Exporter cette section en JPG
            </>
          )}
        </button>
      </div>

      {/* Dialogs */}
      {showSavePresetDialog && sectionType && currentTemplateId && (
        <SavePresetDialog
          sectionType={sectionType.name}
          sectionContent={selectedSection.content}
          currentTemplateId={currentTemplateId}
          onSave={handleSavePreset}
          onClose={() => setShowSavePresetDialog(false)}
        />
      )}

      {showLoadPresetDialog && sectionType && currentTemplateId && (
        <LoadPresetDialog
          sectionType={sectionType.name}
          currentTemplateId={currentTemplateId}
          onLoad={handleLoadPreset}
          onClose={() => setShowLoadPresetDialog(false)}
        />
      )}
    </aside>
  );
}
