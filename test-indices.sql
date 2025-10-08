-- Script SQL pour créer des indices BRVM de test
-- Exécuter dans Supabase SQL Editor ou pgAdmin

-- 1. Créer un groupe d'indices
INSERT INTO brvm_index_groups (slug, name, description, is_active)
VALUES ('indices-principaux', 'Indices Principaux', 'Indices économiques et financiers principaux', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Récupérer l'ID du groupe
DO $$
DECLARE
    group_id_var UUID;
BEGIN
    SELECT id INTO group_id_var FROM brvm_index_groups WHERE slug = 'indices-principaux';
    
    -- 3. Créer les indices
    INSERT INTO brvm_indices (slug, name, code, group_id, metadata, is_active)
    VALUES 
        ('brvm-composite', 'BRVM Composite', 'BRVM-C', group_id_var, '{"unit": "points", "source": "BRVM"}', true),
        ('brvm-10', 'BRVM 10', 'BRVM-10', group_id_var, '{"unit": "points", "source": "BRVM"}', true),
        ('fcfa-eur', 'FCFA/EUR', 'XOF/EUR', group_id_var, '{"unit": "currency", "source": "BCE"}', true),
        ('inflation-uemoa', 'Inflation UEMOA', 'INF-UEMOA', group_id_var, '{"unit": "percent", "source": "BCEAO"}', true)
    ON CONFLICT (slug) DO NOTHING;
    
    -- 4. Ajouter des points de données initiaux
    INSERT INTO brvm_index_points (indice_id, close, change_percent, direction, created_at)
    SELECT 
        i.id,
        CASE 
            WHEN i.slug = 'brvm-composite' THEN 185.42
            WHEN i.slug = 'brvm-10' THEN 165.78
            WHEN i.slug = 'fcfa-eur' THEN 655.957
            WHEN i.slug = 'inflation-uemoa' THEN 4.2
        END,
        CASE 
            WHEN i.slug = 'brvm-composite' THEN '2.3'
            WHEN i.slug = 'brvm-10' THEN '1.8'
            WHEN i.slug = 'fcfa-eur' THEN '-0.1'
            WHEN i.slug = 'inflation-uemoa' THEN '0.5'
        END,
        CASE 
            WHEN i.slug = 'brvm-composite' THEN 'up'
            WHEN i.slug = 'brvm-10' THEN 'up'
            WHEN i.slug = 'fcfa-eur' THEN 'down'
            WHEN i.slug = 'inflation-uemoa' THEN 'up'
        END,
        NOW()
    FROM brvm_indices i
    WHERE i.slug IN ('brvm-composite', 'brvm-10', 'fcfa-eur', 'inflation-uemoa')
    ON CONFLICT DO NOTHING;
    
END $$;
