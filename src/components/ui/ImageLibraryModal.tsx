import { useState, useRef } from 'react';
import { X, Upload, Trash2, Loader2, Search, Check, Image as ImageIcon, FolderPlus, Folder, Pencil, FolderInput, ChevronLeft, CheckSquare, Square } from 'lucide-react';
import { useImageLibrary } from '../../hooks/useImageLibrary';
import type { LibraryImage } from '../../hooks/useImageLibrary';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function ImageLibraryModal({ isOpen, onClose, onSelect, currentValue }: ImageLibraryModalProps) {
  const { 
    images, 
    folders,
    currentFolder,
    setCurrentFolder,
    loading, 
    uploadImage, 
    deleteImage,
    renameImage,
    createFolder,
    moveImagesToFolder,
  } = useImageLibrary();
  
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mode sélection multiple
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  
  // Renommage
  const [renamingImage, setRenamingImage] = useState<LibraryImage | null>(null);
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState(false);
  
  // Création de dossier
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Déplacement vers dossier
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moving, setMoving] = useState(false);

  if (!isOpen) return null;

  // Filtrer les images par dossier courant et recherche
  const filteredImages = images.filter(img => {
    const matchesFolder = img.folder === currentFolder;
    const matchesSearch = img.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && (searchQuery === '' || matchesSearch);
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue; // Max 10MB
        
        const newImage = await uploadImage(file, currentFolder);
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

    if (!confirm(`Supprimer "${image.displayName}" ?`)) return;

    setDeleting(image.id);
    try {
      await deleteImage(image);
      if (selectedImage === image.url) {
        setSelectedImage(null);
      }
      selectedImages.delete(image.id);
      setSelectedImages(new Set(selectedImages));
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

  // Toggle sélection d'une image en mode sélection
  const toggleImageSelection = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  // Quitter le mode sélection
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedImages(new Set());
  };

  // Renommer une image
  const handleRename = async () => {
    if (!renamingImage || !newName.trim() || renaming) return;
    
    setRenaming(true);
    try {
      await renameImage(renamingImage, newName.trim());
      setRenamingImage(null);
      setNewName('');
    } catch (err) {
      console.error('Rename error:', err);
    } finally {
      setRenaming(false);
    }
  };

  // Créer un dossier
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  // Déplacer les images sélectionnées vers un dossier
  const handleMoveToFolder = async (targetFolder: string) => {
    if (selectedImages.size === 0 || moving) return;
    
    setMoving(true);
    try {
      await moveImagesToFolder(Array.from(selectedImages), targetFolder);
      setSelectedImages(new Set());
      setSelectionMode(false);
      setShowMoveModal(false);
    } catch (err) {
      console.error('Move error:', err);
    } finally {
      setMoving(false);
    }
  };

  // Ouvrir le modal de renommage
  const openRenameModal = (image: LibraryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingImage(image);
    setNewName(image.displayName);
  };

  // Obtenir le dossier courant
  const currentFolderInfo = folders.find(f => f.path === currentFolder);

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
          <div className="flex items-center gap-3">
            {currentFolder && (
              <button
                onClick={() => setCurrentFolder('')}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Retour"
              >
                <ChevronLeft size={20} className="text-gray-500" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {currentFolderInfo ? currentFolderInfo.name : "Bibliothèque d'images"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {selectionMode ? (
              <button
                onClick={exitSelectionMode}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler sélection
              </button>
            ) : (
              <button
                onClick={() => setSelectionMode(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Mode sélection"
              >
                <CheckSquare size={18} className="text-gray-500" />
              </button>
            )}
            <button
              onClick={() => setShowCreateFolder(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Nouveau dossier"
            >
              <FolderPlus size={18} className="text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Folders bar */}
        {!currentFolder && folders.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.path)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Folder size={16} className="text-[#1E90FF]" />
                <span className="text-sm text-gray-700">{folder.name}</span>
                <span className="text-xs text-gray-400">({folder.imageCount})</span>
              </button>
            ))}
          </div>
        )}

        {/* Selection mode toolbar */}
        {selectionMode && selectedImages.size > 0 && (
          <div className="px-6 py-3 border-b border-gray-100 bg-blue-50 flex items-center justify-between">
            <span className="text-sm text-[#1E90FF] font-medium">
              {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''} sélectionnée{selectedImages.size > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowMoveModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0066CC] transition-colors text-sm"
            >
              <FolderInput size={16} />
              Déplacer vers...
            </button>
          </div>
        )}

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
                {searchQuery ? 'Aucune image trouvée' : 'Aucune image dans ce dossier'}
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
                  onClick={() => selectionMode ? toggleImageSelection(image.id, { stopPropagation: () => {} } as React.MouseEvent) : setSelectedImage(image.url)}
                  className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImages.has(image.id)
                      ? 'border-[#1E90FF] ring-2 ring-[#1E90FF]/30'
                      : selectedImage === image.url
                      ? 'border-[#1E90FF] ring-2 ring-[#1E90FF]/30'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.displayName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Checkbox pour mode sélection (visible au survol ou si sélectionné) */}
                  {selectionMode && (
                    <div 
                      className={`absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center transition-all z-20 ${
                        selectedImages.has(image.id) 
                          ? 'bg-[#1E90FF] opacity-100' 
                          : 'bg-white/80 opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => toggleImageSelection(image.id, e)}
                    >
                      {selectedImages.has(image.id) ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <Square size={14} className="text-gray-400" />
                      )}
                    </div>
                  )}

                  {/* Selection indicator (mode normal) */}
                  {!selectionMode && selectedImage === image.url && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-[#1E90FF] rounded-full flex items-center justify-center z-20">
                      <Check size={14} className="text-white" />
                    </div>
                  )}

                  {/* Hover overlay avec boutons */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 z-10">
                    {!selectionMode && (
                      <>
                        <button
                          onClick={(e) => openRenameModal(image, e)}
                          className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Renommer"
                        >
                          <Pencil size={16} />
                        </button>
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
                      </>
                    )}
                  </div>

                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate font-medium">
                      {image.displayName}
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
            {currentFolder && ` dans "${currentFolderInfo?.name || currentFolder}"`}
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
              disabled={!selectedImage || selectionMode}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1E90FF] rounded-lg hover:bg-[#0066CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      {/* Modal de renommage */}
      {renamingImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setRenamingImage(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Renommer l'image</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] mb-4"
              placeholder="Nouveau nom"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRenamingImage(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRename}
                disabled={renaming || !newName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1E90FF] rounded-lg hover:bg-[#0066CC] disabled:opacity-50"
              >
                {renaming ? <Loader2 size={16} className="animate-spin" /> : 'Renommer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de dossier */}
      {showCreateFolder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreateFolder(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau dossier</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] mb-4"
              placeholder="Nom du dossier"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1E90FF] rounded-lg hover:bg-[#0066CC] disabled:opacity-50"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de déplacement vers dossier */}
      {showMoveModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowMoveModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Déplacer vers</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentFolder && (
                <button
                  onClick={() => handleMoveToFolder('')}
                  disabled={moving}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <Folder size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Racine (sans dossier)</span>
                </button>
              )}
              {folders.filter(f => f.path !== currentFolder).map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveToFolder(folder.path)}
                  disabled={moving}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <Folder size={20} className="text-[#1E90FF]" />
                  <span className="text-sm text-gray-700">{folder.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">({folder.imageCount})</span>
                </button>
              ))}
              {folders.length === 0 && !currentFolder && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Aucun dossier disponible. Créez-en un d'abord.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
            {moving && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <Loader2 size={24} className="animate-spin text-[#1E90FF]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
