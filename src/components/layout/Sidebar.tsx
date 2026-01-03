import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { ProjectManager } from '../projects/ProjectManager';
import { useTemplates } from '../../hooks/useSupabase';
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
}

function SortableSectionItem({ section, isSelected, onSelect, onDelete }: SortableSectionItemProps) {
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
          ? 'bg-violet-50 border border-violet-500'
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
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
        <p className="text-xs text-gray-500">Template: {section.templateId}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function Sidebar() {
  const { 
    sections, 
    selectedSectionId, 
    currentTemplateId,
    selectSection, 
    removeSection, 
    reorderSections,
    addSection,
    setCurrentTemplate,
  } = useEmailStore();

  const { templates, loading: templatesLoading } = useTemplates();

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

  const handleAddSection = () => {
    const newSection: EmailSection = {
      id: `section-${Date.now()}`,
      templateId: 'hero',
      name: `Section ${sections.length + 1}`,
      content: {},
      order: sections.length,
    };
    addSection(newSection);
    selectSection(newSection.id);
  };

  return (
    <aside className="w-72 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
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
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Sections</h2>
          <button
            onClick={handleAddSection}
            className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-all text-white"
          >
            <Plus size={18} />
          </button>
        </div>

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
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => selectSection(section.id)}
                  onDelete={() => removeSection(section.id)}
                />
              ))}
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
