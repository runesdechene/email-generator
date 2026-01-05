-- Script pour ajouter la section Image + Texte dans la base de données
-- À exécuter dans Supabase SQL Editor

-- Vérifier si la section Image + Texte existe déjà
DO $$
BEGIN
  -- Supprimer la section Image + Texte si elle existe déjà (pour éviter les doublons)
  DELETE FROM sections WHERE name = 'Image + Texte';
  
  -- Ajouter la section Image + Texte
  INSERT INTO sections (name, description, default_content)
  VALUES (
    'Image + Texte',
    'Section pour afficher une image avec du texte superposé, formes personnalisées et overlay',
    '{
      "content": "<h1>Titre</h1><p>Votre texte ici...</p>",
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
          "opacity": 50,
          "blur": 0
        },
        "color": "#ffffff",
        "fontSize": 16,
        "font": "paragraph",
        "textStyle": {
          "align": "left",
          "bold": false,
          "italic": false,
          "underline": false,
          "lineHeight": 1.5,
          "letterSpacing": 0
        },
        "paddingTop": 40,
        "paddingBottom": 40,
        "paddingLeft": 40,
        "paddingRight": 40,
        "customCSS": ""
      }
    }'::jsonb
  );
END $$;

-- Vérifier que la section a été ajoutée
SELECT id, name, description, created_at 
FROM sections 
WHERE name = 'Image + Texte';
