import type { EmailSection } from '../../types';
import { ParagraphSection } from '../../sections/ParagraphSection';

interface SectionRendererProps {
  section: EmailSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  // Nouvelle architecture : une seule section pour l'instant
  if (section.templateId === 'paragraph') {
    return (
      <ParagraphSection
        data={{
          title: (section.content.title as string) || 'Titre de section',
          subtitle: (section.content.subtitle as string) || 'Sous-titre ou description',
        }}
        options={section.content.options as any}
      />
    );
  }

  // Fallback pour les sections non reconnues
  return (
    <div className="bg-zinc-50 p-8 text-center">
      <p className="text-zinc-400">Section non reconnue : {section.templateId}</p>
    </div>
  );
}
