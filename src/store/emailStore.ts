import { create } from 'zustand';
import type { EmailSection } from '../types';

interface EmailStore {
  sections: EmailSection[];
  selectedSectionId: string | null;
  currentTemplateId: string | null;
  currentProjectId: string | null;
  
  addSection: (section: EmailSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<EmailSection>) => void;
  reorderSections: (sections: EmailSection[]) => void;
  selectSection: (id: string | null) => void;
  setCurrentTemplate: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  sections: [],
  selectedSectionId: null,
  currentTemplateId: null,
  currentProjectId: null,

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

  setCurrentProject: (id) => set({ currentProjectId: id }),
}));
