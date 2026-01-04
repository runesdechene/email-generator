export const ParagraphSectionConfig = {
  id: 'paragraph',
  name: 'Paragraphe',
  icon: 'Type',
  description: 'Section avec titre et sous-titre',
  
  // 🧱 BRIQUES ET OPTIONS
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Titre',
      brick: 'TitleBrick',
      defaultValue: 'Titre de section',
      options: {
        fontSize: {
          type: 'number',
          label: 'Taille du titre',
          min: 16,
          max: 48,
          default: 24,
          unit: 'px'
        },
        fontWeight: {
          type: 'select',
          label: 'Poids du titre',
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Gras' },
            { value: 'extrabold', label: 'Extra gras' }
          ],
          default: 'bold'
        },
        color: {
          type: 'color',
          label: 'Couleur du titre',
          default: '#1f2937'
        },
        align: {
          type: 'select',
          label: 'Alignement',
          options: [
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' }
          ],
          default: 'left'
        }
      }
    },
    {
      id: 'subtitle',
      type: 'text',
      label: 'Sous-titre',
      brick: 'ParagraphBrick',
      defaultValue: 'Sous-titre ou description de la section',
      options: {
        fontSize: {
          type: 'number',
          label: 'Taille du sous-titre',
          min: 12,
          max: 24,
          default: 16,
          unit: 'px'
        },
        color: {
          type: 'color',
          label: 'Couleur du sous-titre',
          default: '#6b7280'
        },
        align: {
          type: 'select',
          label: 'Alignement',
          options: [
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' }
          ],
          default: 'left'
        },
        lineHeight: {
          type: 'number',
          label: 'Hauteur de ligne',
          min: 1,
          max: 2.5,
          step: 0.1,
          default: 1.6
        }
      }
    }
  ],
  
  // Style du conteneur
  containerOptions: {
    padding: {
      type: 'number',
      label: 'Espacement interne',
      min: 0,
      max: 100,
      default: 32,
      unit: 'px'
    },
    backgroundColor: {
      type: 'color',
      label: 'Couleur de fond',
      default: 'transparent'
    }
  }
} as const;

export type ParagraphSectionConfig = typeof ParagraphSectionConfig;
