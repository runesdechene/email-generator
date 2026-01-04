import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { SupabaseStorageService } from '../../services/supabase-storage.service';

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  sectionId: string;
  label?: string;
}

export function ImagePicker({ value, onChange, sectionId, label = "Image" }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const url = await SupabaseStorageService.uploadSectionImage(file, sectionId);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (value) {
      // Supprimer l'image du storage (en arrière-plan, sans bloquer)
      SupabaseStorageService.deleteSectionImage(value).catch(console.error);
      onChange('');
    }
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
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <X size={16} />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1E90FF] hover:bg-blue-50 transition-all">
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 size={32} className="animate-spin text-[#1E90FF]" />
                  <p className="text-sm text-gray-600">Upload en cours...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ImageIcon size={24} className="text-[#1E90FF]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Cliquez pour choisir une image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF jusqu'à 5MB
                    </p>
                  </div>
                  <Upload size={16} className="text-gray-400" />
                </>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
