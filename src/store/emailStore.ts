import { create } from 'zustand';
import type { EmailSection, EmailTemplate } from '../types';

interface EmailStore {
  sections: EmailSection[];
  selectedSectionId: string | null;
  currentTemplateId: string | null;
  templates: EmailTemplate[];
  
  addSection: (section: EmailSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<EmailSection>) => void;
  reorderSections: (sections: EmailSection[]) => void;
  selectSection: (id: string | null) => void;
  setCurrentTemplate: (id: string) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  sections: [],
  selectedSectionId: null,
  currentTemplateId: null,
  templates: [
    { id: 'default', name: 'Template par défaut', description: 'Template standard' },
    { id: 'promo', name: 'Promotion', description: 'Template promotionnel' },
    { id: 'newsletter', name: 'Newsletter', description: 'Template newsletter' },
  ],

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
    })),

  updateSection: (id, updates) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  reorderSections: (sections) => set({ sections }),

  selectSection: (id) => set({ selectedSectionId: id }),

  setCurrentTemplate: (id) => set({ currentTemplateId: id }),
}));
