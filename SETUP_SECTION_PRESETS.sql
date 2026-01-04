-- Script SQL pour créer le système de Presets de Sections dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer la table section_presets
CREATE TABLE IF NOT EXISTS section_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  section_type TEXT NOT NULL, -- 'Texte', etc.
  content JSONB NOT NULL, -- Tous les réglages de la section
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Créer la table de liaison preset <-> templates (many-to-many)
CREATE TABLE IF NOT EXISTS preset_templates (
  preset_id UUID NOT NULL REFERENCES section_presets(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  PRIMARY KEY (preset_id, template_id)
);

-- 3. Ajouter des index pour les performances
CREATE INDEX IF NOT EXISTS idx_section_presets_user_id ON section_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_section_presets_section_type ON section_presets(section_type);
CREATE INDEX IF NOT EXISTS idx_preset_templates_preset_id ON preset_templates(preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_templates_template_id ON preset_templates(template_id);

-- 4. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_section_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_section_presets_updated_at ON section_presets;
CREATE TRIGGER trigger_update_section_presets_updated_at
  BEFORE UPDATE ON section_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_section_presets_updated_at();

-- 6. Activer RLS (Row Level Security)
ALTER TABLE section_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_templates ENABLE ROW LEVEL SECURITY;

-- 7. Politiques RLS pour section_presets
-- Les utilisateurs peuvent voir uniquement leurs propres presets
CREATE POLICY "Users can view their own presets" ON section_presets
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres presets
CREATE POLICY "Users can create their own presets" ON section_presets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres presets
CREATE POLICY "Users can update their own presets" ON section_presets
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres presets
CREATE POLICY "Users can delete their own presets" ON section_presets
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Politiques RLS pour preset_templates
-- Les utilisateurs peuvent voir les liaisons de leurs propres presets
CREATE POLICY "Users can view their preset templates" ON preset_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM section_presets
      WHERE section_presets.id = preset_templates.preset_id
      AND section_presets.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des liaisons pour leurs propres presets
CREATE POLICY "Users can create preset template links" ON preset_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM section_presets
      WHERE section_presets.id = preset_templates.preset_id
      AND section_presets.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent supprimer des liaisons de leurs propres presets
CREATE POLICY "Users can delete preset template links" ON preset_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM section_presets
      WHERE section_presets.id = preset_templates.preset_id
      AND section_presets.user_id = auth.uid()
    )
  );

-- Vérification
SELECT 'Tables section_presets et preset_templates créées avec succès' AS status;
