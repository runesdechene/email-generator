import { useState } from 'react';
import { X, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { ImageLibraryModal } from './ImageLibraryModal';

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  sectionId: string;
  label?: string;
}

export function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemove = () => {
    onChange('');
  };

  const handleSelect = (url: string) => {
    onChange(url);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        {label}
      </label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Section image"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0066CC] transition-all"
            >
              <FolderOpen size={16} />
              Changer
            </button>
            <button
              onClick={handleRemove}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <X size={16} />
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1E90FF] hover:bg-blue-50 transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ImageIcon size={24} className="text-[#1E90FF]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Choisir une image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Depuis la bibliothèque
              </p>
            </div>
            <FolderOpen size={16} className="text-gray-400" />
          </div>
        </button>
      )}

      <ImageLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        currentValue={value}
      />
    </div>
  );
}
