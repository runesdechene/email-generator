import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export interface LibraryImage {
  id: string;
  name: string;
  displayName: string;
  url: string;
  size: number;
  createdAt: string;
  folder: string;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  imageCount: number;
}

const BUCKET = 'section-images';
const FOLDERS_KEY = 'image-library-folders';

// Récupérer les dossiers depuis localStorage
const getFoldersFromStorage = (): ImageFolder[] => {
  try {
    const stored = localStorage.getItem(FOLDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Sauvegarder les dossiers dans localStorage
const saveFoldersToStorage = (folders: ImageFolder[]) => {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

// Extraire le nom d'affichage depuis le nom de fichier
const extractDisplayName = (fileName: string): string => {
  // Format: timestamp_originalname.ext ou folder/timestamp_originalname.ext
  const baseName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;
  const match = baseName.match(/^\d+_(.+)$/);
  return match ? match[1] : baseName;
};

export function useImageLibrary() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [folders, setFolders] = useState<ImageFolder[]>(getFoldersFromStorage());
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les images du bucket
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les images du dossier racine
      const { data: rootData, error: rootError } = await supabase.storage
        .from(BUCKET)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (rootError) throw rootError;

      // Charger les images de tous les dossiers connus
      const storedFolders = getFoldersFromStorage();
      const allFolderImages: any[] = [];

      for (const folder of storedFolders) {
        const { data: folderData } = await supabase.storage
          .from(BUCKET)
          .list(folder.path, {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'desc' },
          });
        
        if (folderData) {
          allFolderImages.push(...folderData.map(f => ({ ...f, folder: folder.path })));
        }
      }

      // Combiner toutes les images
      const allData = [
        ...(rootData || []).map(f => ({ ...f, folder: '' })),
        ...allFolderImages
      ];

      // Transformer les données en LibraryImage
      const libraryImages: LibraryImage[] = allData
        .filter(file => !file.name.endsWith('/') && file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const fullPath = file.folder ? `${file.folder}/${file.name}` : file.name;
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fullPath);

          return {
            id: file.id || fullPath,
            name: fullPath,
            displayName: extractDisplayName(file.name),
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at || new Date().toISOString(),
            folder: file.folder || '',
          };
        });

      setImages(libraryImages);

      // Mettre à jour le compte d'images par dossier
      const updatedFolders = storedFolders.map(folder => ({
        ...folder,
        imageCount: libraryImages.filter(img => img.folder === folder.path).length
      }));
      setFolders(updatedFolders);
      saveFoldersToStorage(updatedFolders);

    } catch (err) {
      console.error('Error loading images:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Uploader une nouvelle image
  const uploadImage = useCallback(async (file: File, targetFolder: string = ''): Promise<LibraryImage | null> => {
    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
      const fileName = targetFolder ? `${targetFolder}/${timestamp}_${cleanName}` : `${timestamp}_${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      const newImage: LibraryImage = {
        id: fileName,
        name: fileName,
        displayName: extractDisplayName(fileName),
        url: urlData.publicUrl,
        size: file.size,
        createdAt: new Date().toISOString(),
        folder: targetFolder,
      };

      setImages(prev => [newImage, ...prev]);
      return newImage;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    }
  }, []);

  // Supprimer une image
  const deleteImage = useCallback(async (image: LibraryImage): Promise<void> => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET)
        .remove([image.name]);

      if (deleteError) throw deleteError;

      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (err) {
      console.error('Error deleting image:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }, []);

  // Renommer une image (change le displayName en copiant le fichier)
  const renameImage = useCallback(async (image: LibraryImage, newDisplayName: string): Promise<LibraryImage | null> => {
    try {
      // Télécharger le fichier existant
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET)
        .download(image.name);

      if (downloadError) throw downloadError;

      // Créer le nouveau nom de fichier
      const timestamp = Date.now();
      const cleanName = newDisplayName.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
      const newFileName = image.folder 
        ? `${image.folder}/${timestamp}_${cleanName}`
        : `${timestamp}_${cleanName}`;

      // Uploader avec le nouveau nom
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(newFileName, fileData, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Supprimer l'ancien fichier
      await supabase.storage.from(BUCKET).remove([image.name]);

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(newFileName);

      const renamedImage: LibraryImage = {
        id: newFileName,
        name: newFileName,
        displayName: newDisplayName,
        url: urlData.publicUrl,
        size: image.size,
        createdAt: image.createdAt,
        folder: image.folder,
      };

      setImages(prev => prev.map(img => img.id === image.id ? renamedImage : img));
      return renamedImage;
    } catch (err) {
      console.error('Error renaming image:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du renommage');
    }
  }, []);

  // Créer un nouveau dossier
  const createFolder = useCallback((name: string): ImageFolder => {
    const cleanName = name.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 50);
    const newFolder: ImageFolder = {
      id: `folder_${Date.now()}`,
      name: name,
      path: cleanName,
      imageCount: 0,
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);
    return newFolder;
  }, [folders]);

  // Supprimer un dossier (les images restent à la racine)
  const deleteFolder = useCallback(async (folderId: string): Promise<void> => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    // Déplacer toutes les images du dossier vers la racine
    const folderImages = images.filter(img => img.folder === folder.path);
    for (const img of folderImages) {
      await moveImageToFolder(img, '');
    }

    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);
  }, [folders, images]);

  // Déplacer une image vers un dossier
  const moveImageToFolder = useCallback(async (image: LibraryImage, targetFolder: string): Promise<LibraryImage | null> => {
    try {
      if (image.folder === targetFolder) return image;

      // Télécharger le fichier existant
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET)
        .download(image.name);

      if (downloadError) throw downloadError;

      // Créer le nouveau chemin
      const baseName = image.name.includes('/') ? image.name.split('/').pop()! : image.name;
      const newPath = targetFolder ? `${targetFolder}/${baseName}` : baseName;

      // Uploader au nouveau chemin
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, fileData, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Supprimer l'ancien fichier
      await supabase.storage.from(BUCKET).remove([image.name]);

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(newPath);

      const movedImage: LibraryImage = {
        ...image,
        id: newPath,
        name: newPath,
        url: urlData.publicUrl,
        folder: targetFolder,
      };

      setImages(prev => prev.map(img => img.id === image.id ? movedImage : img));
      return movedImage;
    } catch (err) {
      console.error('Error moving image:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du déplacement');
    }
  }, []);

  // Déplacer plusieurs images vers un dossier
  const moveImagesToFolder = useCallback(async (imageIds: string[], targetFolder: string): Promise<void> => {
    const imagesToMove = images.filter(img => imageIds.includes(img.id));
    for (const img of imagesToMove) {
      await moveImageToFolder(img, targetFolder);
    }
    // Recharger les images pour mettre à jour les compteurs
    await loadImages();
  }, [images, moveImageToFolder, loadImages]);

  // Charger les images au montage
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    folders,
    currentFolder,
    setCurrentFolder,
    loading,
    error,
    uploadImage,
    deleteImage,
    renameImage,
    createFolder,
    deleteFolder,
    moveImageToFolder,
    moveImagesToFolder,
    refreshImages: loadImages,
  };
}
