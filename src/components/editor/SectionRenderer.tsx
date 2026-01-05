import type { EmailSection } from '../../types';
import { ParagraphSection } from '../../sections/ParagraphSection';
import { HeroSection } from '../sections/HeroSection';
import { ImageSection } from '../../sections/ImageSection/ImageSection';
import { ImageTextSection } from '../../sections/ImageTextSection/ImageTextSection';
import { useSectionTemplates } from '../../hooks/useSupabase';
import { AlertCircle } from 'lucide-react';

interface SectionRendererProps {
  section: EmailSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const { sectionTemplates, loading } = useSectionTemplates();
  
  // Pendant le chargement, afficher un placeholder neutre
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  // Trouver le type de section correspondant
  const sectionType = sectionTemplates.find(t => t.id === section.templateId);
  
  // Si le type de section est "Texte HTML" (par nom, pas par ID)
  if (sectionType?.name === 'Texte HTML') {
    return (
      <ParagraphSection
        sectionId={section.id}
        data={{
          content: (section.content.content as string) || '<p>Votre contenu ici...</p>',
        }}
        options={section.content.options as any}
      />
    );
  }

  // Si le type de section est "Texte" (simple, sans HTML)
  if (sectionType?.name === 'Texte') {
    const textContent = (section.content.content as string) || 'Votre texte ici...';
    return (
      <ParagraphSection
        sectionId={section.id}
        data={{
          content: `<p>${textContent}</p>`,
        }}
        options={section.content.options as any}
      />
    );
  }

  // Si le type de section est "Hero"
  if (sectionType?.name === 'Hero') {
    return <HeroSection section={section} />;
  }

  // Si le type de section est "Image"
  if (sectionType?.name === 'Image') {
    return (
      <ImageSection
        sectionId={section.id}
        options={section.content.options as any}
      />
    );
  }

  // Si le type de section est "Image + Texte"
  if (sectionType?.name === 'Image + Texte') {
    return (
      <ImageTextSection
        sectionId={section.id}
        content={{
          content: (section.content.content as string) || '<p>Votre contenu ici...</p>',
        }}
        options={section.content.options as any}
      />
    );
  }

  // Fallback pour les sections non reconnues (seulement après le chargement)
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
      <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
        <AlertCircle size={20} />
        <p className="font-semibold">Type de section non reconnu</p>
      </div>
      <p className="text-sm text-red-500 mb-3">
        {sectionType ? `Type "${sectionType.name}" non implémenté` : `ID: ${section.templateId}`}
      </p>
      <p className="text-xs text-gray-600">
        Supprimez cette section et créez-en une nouvelle depuis le panneau de droite
      </p>
    </div>
  );
}
