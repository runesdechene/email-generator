import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export interface LibraryImage {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

const BUCKET = 'section-images';

export function useImageLibrary() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les images du bucket
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: listError } = await supabase.storage
        .from(BUCKET)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) throw listError;

      // Transformer les données en LibraryImage
      const libraryImages: LibraryImage[] = (data || [])
        .filter(file => !file.id.endsWith('/')) // Exclure les dossiers
        .map(file => {
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(file.name);

          return {
            id: file.id,
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at || new Date().toISOString(),
          };
        });

      setImages(libraryImages);
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Uploader une nouvelle image
  const uploadImage = useCallback(async (file: File): Promise<LibraryImage | null> => {
    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
      const fileName = `${timestamp}_${cleanName}`;

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
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        createdAt: new Date().toISOString(),
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

  // Charger les images au montage
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    loading,
    error,
    uploadImage,
    deleteImage,
    refreshImages: loadImages,
  };
}
