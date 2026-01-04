-- Script SQL pour configurer l'authentification et Row Level Security (RLS)
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter la colonne user_id aux tables existantes
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Activer Row Level Security (RLS) sur les tables
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS pour templates
-- Politique de lecture : un utilisateur peut voir uniquement ses templates
CREATE POLICY "Users can view their own templates"
ON templates FOR SELECT
USING (auth.uid() = user_id);

-- Politique d'insertion : un utilisateur peut créer ses propres templates
CREATE POLICY "Users can create their own templates"
ON templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique de mise à jour : un utilisateur peut modifier uniquement ses templates
CREATE POLICY "Users can update their own templates"
ON templates FOR UPDATE
USING (auth.uid() = user_id);

-- Politique de suppression : un utilisateur peut supprimer uniquement ses templates
CREATE POLICY "Users can delete their own templates"
ON templates FOR DELETE
USING (auth.uid() = user_id);

-- 4. Créer les politiques RLS pour projects
-- Politique de lecture : un utilisateur peut voir uniquement ses projets
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

-- Politique d'insertion : un utilisateur peut créer ses propres projets
CREATE POLICY "Users can create their own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique de mise à jour : un utilisateur peut modifier uniquement ses projets
CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

-- Politique de suppression : un utilisateur peut supprimer uniquement ses projets
CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);

-- 5. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS templates_user_id_idx ON templates(user_id);
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);

-- 6. Fonction pour créer automatiquement un template par défaut pour les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer un template par défaut pour le nouvel utilisateur
  INSERT INTO public.templates (
    user_id,
    name,
    description,
    fonts,
    colors,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'Mon premier template',
    'Template de démarrage',
    '{"title": "Roboto", "paragraph": "Open Sans"}',
    '{"primary": "#8B5CF6", "secondary": "#EC4899", "background": "#FFFFFF", "text": "#1F2937", "accent": "#F59E0B"}',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Créer un trigger pour exécuter la fonction lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Note : Après avoir exécuté ce script, vous devrez mettre à jour manuellement
-- les templates et projets existants pour leur assigner un user_id
-- ou les supprimer si ce sont des données de test.
