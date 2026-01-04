-- Script SQL pour ajouter les colonnes custom_colors et font_sizes à la table templates
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne custom_colors (tableau JSON de couleurs personnalisées)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS custom_colors JSONB DEFAULT '[]'::jsonb;

-- Ajouter la colonne font_sizes (objet JSON avec les tailles de texte)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS font_sizes JSONB DEFAULT '{"xxl": 48, "xl": 36, "l": 24, "m": 16, "s": 14, "xs": 12}'::jsonb;

-- Mettre à jour les templates existants avec les valeurs par défaut si elles sont NULL
UPDATE templates 
SET custom_colors = '[]'::jsonb 
WHERE custom_colors IS NULL;

UPDATE templates 
SET font_sizes = '{"xxl": 48, "xl": 36, "l": 24, "m": 16, "s": 14, "xs": 12}'::jsonb 
WHERE font_sizes IS NULL;
