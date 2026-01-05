import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { ImagePicker } from '../ImagePicker';

interface IconBlock {
  id: string;
  imageUrl?: string;
  title: string;
  text: string;
}

interface IconBlocksControlProps {
  blocks: IconBlock[];
  sectionId: string;
  onUpdate: (path: string[], value: any) => void;
}

export function IconBlocksControl({ blocks = [], sectionId, onUpdate }: IconBlocksControlProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(blocks[0]?.id || null);

  const addBlock = () => {
    const newBlock: IconBlock = {
      id: Date.now().toString(),
      imageUrl: '',
      title: 'Nouveau titre',
      text: 'Votre texte ici...',
    };
    onUpdate(['blocks'], [...blocks, newBlock]);
    setExpandedBlock(newBlock.id);
  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    onUpdate(['blocks'], newBlocks);
    if (expandedBlock === id) {
      setExpandedBlock(newBlocks[0]?.id || null);
    }
  };

  const updateBlock = (id: string, field: keyof IconBlock, value: string) => {
    const newBlocks = blocks.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    );
    onUpdate(['blocks'], newBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onUpdate(['blocks'], newBlocks);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-700">
          Blocs (Icône + Titre + Texte)
        </label>
        <button
          onClick={addBlock}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#1E90FF] text-white text-xs rounded-lg hover:bg-[#1873CC] transition-colors"
        >
          <Plus size={14} />
          Ajouter un bloc
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Bloc {index + 1}: {block.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(index, 'up');
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Monter"
                  >
                    <ChevronUp size={16} />
                  </button>
                )}
                {index < blocks.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(index, 'down');
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Descendre"
                  >
                    <ChevronDown size={16} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.id);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedBlock === block.id && (
              <div className="p-3 space-y-3 bg-white">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Icône/Image
                  </label>
                  <ImagePicker
                    value={block.imageUrl || ''}
                    onChange={(url) => updateBlock(block.id, 'imageUrl', url)}
                    sectionId={`${sectionId}-${block.id}`}
                    label="Image du bloc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                    placeholder="Titre du bloc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Texte
                  </label>
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                    rows={3}
                    placeholder="Texte du bloc"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Aucun bloc. Cliquez sur "Ajouter un bloc" pour commencer.
        </div>
      )}
    </div>
  );
}
