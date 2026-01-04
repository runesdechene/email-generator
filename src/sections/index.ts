// Export de toutes les sections disponibles
export { ParagraphSection } from './ParagraphSection';
export { ParagraphSectionConfig } from './ParagraphSection/config';

// Liste de toutes les sections disponibles
import { ParagraphSectionConfig } from './ParagraphSection/config';

export const AVAILABLE_SECTIONS = [
  ParagraphSectionConfig,
] as const;
