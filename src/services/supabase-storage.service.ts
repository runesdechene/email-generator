import { supabase } from '../config/supabase';

export class SupabaseStorageService {
  private static BUCKET = 'template-backgrounds';
  private static SECTION_IMAGES_BUCKET = 'section-images';

  /**
   * Upload une image de background pour un template
   * @param file - Le fichier image à uploader
   * @param templateId - L'ID du template
   * @returns L'URL publique de l'image uploadée
   */
  static async uploadTemplateBackground(file: File, templateId: string): Promise<string> {
    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `${templateId}_${timestamp}.${extension}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from(this.BUCKET)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading template background:', error);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  }

  /**
   * Supprime une image de background
   * @param imageUrl - L'URL de l'image à supprimer
   */
  static async deleteTemplateBackground(imageUrl: string): Promise<void> {
    try {
      // Extraire le nom du fichier depuis l'URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      const { error } = await supabase.storage
        .from(this.BUCKET)
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template background:', error);
      // Ne pas throw ici car l'image peut déjà être supprimée
    }
  }

  /**
   * Upload une image pour une section (Hero, etc.)
   * @param file - Le fichier image à uploader
   * @param sectionId - L'ID de la section
   * @returns L'URL publique de l'image uploadée
   */
  static async uploadSectionImage(file: File, sectionId: string): Promise<string> {
    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `${sectionId}_${timestamp}.${extension}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from(this.SECTION_IMAGES_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from(this.SECTION_IMAGES_BUCKET)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading section image:', error);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  }

  /**
   * Supprime une image de section
   * @param imageUrl - L'URL de l'image à supprimer
   */
  static async deleteSectionImage(imageUrl: string): Promise<void> {
    try {
      // Extraire le nom du fichier depuis l'URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      const { error } = await supabase.storage
        .from(this.SECTION_IMAGES_BUCKET)
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting section image:', error);
      // Ne pas throw ici car l'image peut déjà être supprimée
    }
  }
}
