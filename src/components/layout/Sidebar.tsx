import { useState } from 'react';
import { Plus, GripVertical, Trash2, Copy, Image, Download } from 'lucide-react';
import { ImageLibraryModal } from '../ui/ImageLibraryModal';
import { ProjectManager } from '../projects/ProjectManager';
import { useTemplates, useSectionTemplates } from '../../hooks/useSupabase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEmailStore } from '../../store/emailStore';
import type { EmailSection } from '../../types';

interface SortableSectionItemProps {
  section: EmailSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableSectionItem({ section, isSelected, onSelect, onDelete, onDuplicate, templateName }: SortableSectionItemProps & { templateName?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-2 border-[#1E90FF] shadow-sm'
          : 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-[#1E90FF]'
      }`}
      onClick={onSelect}
    >
      <button
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{section.name}</p>
        {templateName && (
          <p className="text-xs text-gray-500">Type: {templateName}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#1E90FF] transition-all p-1 rounded hover:bg-blue-100"
          title="Dupliquer la section"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 rounded hover:bg-red-50"
          title="Supprimer la section"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

interface SidebarProps {
  onOpenTemplateSelector: () => void;
  onExportAll: () => void;
}

export function Sidebar({ onOpenTemplateSelector, onExportAll }: SidebarProps) {
  const { 
    sections, 
    selectedSectionId, 
    currentTemplateId,
    selectSection, 
    removeSection, 
    duplicateSection,
    reorderSections,
    setCurrentTemplate,
  } = useEmailStore();

  const { templates, loading: templatesLoading } = useTemplates();
  const { sectionTemplates } = useSectionTemplates();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }));
      reorderSections(newSections);
    }
  };

  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const handleAddSection = () => {
    onOpenTemplateSelector();
  };

  return (
    <aside className="w-100 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <ProjectManager />
      </div>

      <div className="p-4 border-b border-gray-200">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Template Général
        </label>
        <select
          value={currentTemplateId || ''}
          onChange={(e) => setCurrentTemplate(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
          disabled={templatesLoading}
        >
          <option value="">
            {templatesLoading ? 'Chargement...' : 'Sélectionner un template'}
          </option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton Bibliothèque d'images */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowImageLibrary(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
        >
          <Image size={18} />
          <span className="text-sm font-medium">Bibliothèque d'images</span>
        </button>
      </div>

      {/* Modal Bibliothèque d'images */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelect={() => setShowImageLibrary(false)}
      />

      {/* Header Sections - Fixe */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Sections</h2>
          <div className="flex items-center gap-2">
            {sections.length > 0 && (
              <button
                onClick={onExportAll}
                className="w-8 h-8 rounded-lg bg-[#FFA500] hover:bg-[#FF8C00] shadow-md hover:shadow-lg flex items-center justify-center transition-all text-white"
                title="Tout exporter en 1 image"
              >
                <Download size={16} />
              </button>
            )}
            <button
              onClick={handleAddSection}
              className="w-8 h-8 rounded-lg bg-[#1E90FF] hover:bg-[#0066CC] shadow-md hover:shadow-lg flex items-center justify-center transition-all text-white"
              title="Ajouter une section"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des sections - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sections.map((section) => {
                const template = sectionTemplates.find(t => t.id === section.templateId);
                return (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => selectSection(section.id)}
                    onDelete={() => removeSection(section.id)}
                    onDuplicate={() => duplicateSection(section.id)}
                    templateName={template?.name}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {sections.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Aucune section</p>
            <p className="text-gray-400 text-xs mt-1">
              Cliquez sur + pour ajouter une section
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
