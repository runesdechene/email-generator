-- Script pour ajouter la section Image dans la base de données
-- À exécuter dans Supabase SQL Editor

-- Vérifier si la section Image existe déjà
DO $$
BEGIN
  -- Supprimer la section Image si elle existe déjà (pour éviter les doublons)
  DELETE FROM sections WHERE name = 'Image';
  
  -- Ajouter la section Image
  INSERT INTO sections (name, description, default_content)
  VALUES (
    'Image',
    'Section pour afficher une image avec formes personnalisées (clip-path) et overlay',
    '{
      "content": "",
      "options": {
        "imageUrl": "",
        "imageSize": 100,
        "clipPath": "none",
        "overlay": {
          "enabled": false,
          "type": "color",
          "color": "#000000",
          "gradientStart": "#000000",
          "gradientEnd": "#ffffff",
          "gradientDirection": "to bottom",
          "opacity": 50
        },
        "paddingTop": 40,
        "paddingBottom": 40,
        "paddingLeft": 20,
        "paddingRight": 20,
        "customCSS": ""
      }
    }'::jsonb
  );
END $$;

-- Vérifier que la section a été ajoutée
SELECT id, name, description, created_at 
FROM sections 
WHERE name = 'Image';
