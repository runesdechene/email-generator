-- Script SQL pour renommer la table section_templates en sections
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Renommer la table
ALTER TABLE section_templates RENAME TO sections;

-- 2. Renommer les index
ALTER INDEX IF EXISTS idx_section_templates_name RENAME TO idx_sections_name;

-- 3. Renommer la fonction de trigger
ALTER FUNCTION update_section_templates_updated_at() RENAME TO update_sections_updated_at;

-- 4. Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS trigger_update_section_templates_updated_at ON sections;

-- 5. Créer le nouveau trigger avec le bon nom
CREATE TRIGGER trigger_update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_sections_updated_at();

-- 6. Mettre à jour les politiques RLS (supprimer les anciennes et créer les nouvelles)
DROP POLICY IF EXISTS "Allow public read access" ON sections;
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON sections;

CREATE POLICY "Allow public read access" ON sections
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage" ON sections
  FOR ALL USING (auth.role() = 'authenticated');

-- Vérification
SELECT 'Migration terminée: section_templates -> sections' AS status;
