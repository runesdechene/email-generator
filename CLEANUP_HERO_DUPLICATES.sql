-- Script SQL pour supprimer les doublons de la section Hero
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Garder seulement la première section Hero (la plus ancienne)
-- et supprimer les doublons
DELETE FROM sections
WHERE name = 'Hero'
AND id NOT IN (
  SELECT id 
  FROM sections 
  WHERE name = 'Hero' 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Vérification - devrait retourner 1 seule ligne
SELECT COUNT(*) as hero_count, name 
FROM sections 
WHERE name = 'Hero'
GROUP BY name;

-- Afficher la section Hero restante
SELECT id, name, created_at 
FROM sections 
WHERE name = 'Hero';
