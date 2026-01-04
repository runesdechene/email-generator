-- Script SQL pour supprimer la colonne button_style de la table templates
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Supprimer la colonne button_style
ALTER TABLE templates DROP COLUMN IF EXISTS button_style;
