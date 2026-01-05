import { useState, useRef } from 'react';
import { X, Upload, Trash2, Loader2, Search, Check, Image as ImageIcon } from 'lucide-react';
import { useImageLibrary } from '../../hooks/useImageLibrary';
import type { LibraryImage } from '../../hooks/useImageLibrary';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function ImageLibraryModal({ isOpen, onClose, onSelect, currentValue }: ImageLibraryModalProps) {
  const { images, loading, uploadImage, deleteImage } = useImageLibrary();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue; // Max 10MB
        
        const newImage = await uploadImage(file);
        if (newImage) {
          setSelectedImage(newImage.url);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (image: LibraryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleting) return;

    if (!confirm(`Supprimer "${image.name}" ?`)) return;

    setDeleting(image.id);
    try {
      await deleteImage(image);
      if (selectedImage === image.url) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[90vw] max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Bibliothèque d'images</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            />
          </div>
        </div>

        {/* Upload zone */}
        <div className="px-6 py-4 border-b border-gray-100">
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#1E90FF] hover:bg-blue-50 transition-all">
              <div className="flex items-center justify-center gap-3">
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-[#1E90FF]" />
                    <span className="text-sm text-gray-600">Upload en cours...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} className="text-[#1E90FF]" />
                    <span className="text-sm font-medium text-gray-700">
                      Ajouter des images
                    </span>
                    <span className="text-xs text-gray-400">
                      (Glisser-déposer ou cliquer)
                    </span>
                  </>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Images grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={32} className="animate-spin text-[#1E90FF]" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ImageIcon size={48} className="mb-3" />
              <p className="text-sm">
                {searchQuery ? 'Aucune image trouvée' : 'Aucune image dans la bibliothèque'}
              </p>
              <p className="text-xs mt-1">
                Uploadez des images pour commencer
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image.url)}
                  className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === image.url
                      ? 'border-[#1E90FF] ring-2 ring-[#1E90FF]/30'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Selection indicator */}
                  {selectedImage === image.url && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-[#1E90FF] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => handleDelete(image, e)}
                      disabled={deleting === image.id}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      {deleting === image.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate font-medium">
                      {image.name}
                    </p>
                    {image.size > 0 && (
                      <p className="text-[10px] text-white/70">
                        {formatFileSize(image.size)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedImage}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1E90FF] rounded-lg hover:bg-[#0066CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
