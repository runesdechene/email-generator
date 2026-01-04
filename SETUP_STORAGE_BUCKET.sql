-- Script SQL pour créer le bucket de stockage des images de sections
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Créer le bucket pour les images de sections
INSERT INTO storage.buckets (id, name, public)
VALUES ('section-images', 'section-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload section images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'section-images');

-- Politique pour permettre la lecture publique
CREATE POLICY "Public read access for section images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'section-images');

-- Politique pour permettre la suppression par le propriétaire
CREATE POLICY "Users can delete their own section images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'section-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Vérification
SELECT 'Bucket section-images créé avec succès' AS status;
