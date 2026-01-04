-- Script SQL pour ajouter la section Hero dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Insérer la section Hero
INSERT INTO sections (name, description, default_content) VALUES
  (
    'Hero',
    'Section Hero avec image et texte pour les en-têtes d''email',
    '{
      "content": "<h1>Titre principal</h1><p>Votre texte ici...</p>",
      "options": {
        "imageUrl": "",
        "imageSize": 80,
        "paddingTop": 32,
        "paddingBottom": 32,
        "paddingLeft": 32,
        "paddingRight": 32,
        "useTemplatePaddingInline": true,
        "useTemplatePaddingBlock": true,
        "font": "title",
        "fontSize": "xl",
        "color": "primary",
        "textStyle": {
          "align": "center",
          "bold": false,
          "italic": false,
          "underline": false,
          "lineHeight": 1.5
        },
        "customCSS": ""
      }
    }'
  )
ON CONFLICT DO NOTHING;

-- Vérification
SELECT 'Section Hero ajoutée avec succès' AS status;
