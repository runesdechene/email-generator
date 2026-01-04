-- Script SQL pour ajouter les colonnes padding_inline et padding_block à la table templates
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne padding_inline (padding gauche/droite par défaut)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS padding_inline INTEGER DEFAULT 32;

-- Ajouter la colonne padding_block (padding haut/bas par défaut)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS padding_block INTEGER DEFAULT 32;

-- Mettre à jour les templates existants avec les valeurs par défaut si elles sont NULL
UPDATE templates 
SET padding_inline = 32 
WHERE padding_inline IS NULL;

UPDATE templates 
SET padding_block = 32 
WHERE padding_block IS NULL;
