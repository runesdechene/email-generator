-- Script SQL pour créer la table section_templates dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Créer la table section_templates
CREATE TABLE IF NOT EXISTS section_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  default_content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajouter un index sur le nom pour les recherches
CREATE INDEX IF NOT EXISTS idx_section_templates_name ON section_templates(name);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_section_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_section_templates_updated_at ON section_templates;
CREATE TRIGGER trigger_update_section_templates_updated_at
  BEFORE UPDATE ON section_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_section_templates_updated_at();

-- Insérer le template de section Paragraph
INSERT INTO section_templates (name, description, default_content) VALUES
  ('Paragraph', 'Section de paragraphe avec titre et contenu', '{"title": "Titre de section", "subtitle": "Sous-titre ou description"}')
ON CONFLICT DO NOTHING;

-- Activer RLS (Row Level Security) si nécessaire
ALTER TABLE section_templates ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous (ajustez selon vos besoins)
CREATE POLICY "Allow public read access" ON section_templates
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion/modification/suppression (ajustez selon vos besoins)
CREATE POLICY "Allow authenticated users to manage" ON section_templates
  FOR ALL USING (auth.role() = 'authenticated');
