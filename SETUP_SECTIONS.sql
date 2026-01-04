-- Script SQL pour créer la table sections dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Créer la table sections
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  default_content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ajouter un index sur le nom pour les recherches
CREATE INDEX IF NOT EXISTS idx_sections_name ON sections(name);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_sections_updated_at ON sections;
CREATE TRIGGER trigger_update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_sections_updated_at();

-- Insérer le template de section Texte
INSERT INTO sections (name, description, default_content) VALUES
  ('Texte', 'Section de texte personnalisable avec options de style', '{"content": "<p>Votre contenu ici...</p>"}')
ON CONFLICT DO NOTHING;

-- Activer RLS (Row Level Security)
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access" ON sections
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion/modification/suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to manage" ON sections
  FOR ALL USING (auth.role() = 'authenticated');
