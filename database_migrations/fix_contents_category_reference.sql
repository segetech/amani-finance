-- Migration pour corriger la référence de catégorie dans la table contents
-- À exécuter dans Supabase SQL Editor

-- Insérer les catégories par défaut dans content_categories si elles n'existent pas
INSERT INTO content_categories (name, slug, description, color, icon, content_types) 
VALUES
('Économie', 'economie', 'Actualités économiques africaines', '#3B82F6', 'TrendingUp', ARRAY['article', 'podcast', 'indice']),
('Marchés Financiers', 'marches-financiers', 'BRVM et marchés financiers', '#10B981', 'BarChart3', ARRAY['article', 'podcast', 'indice']),
('Politique Monétaire', 'politique-monetaire', 'Décisions des banques centrales', '#8B5CF6', 'Banknote', ARRAY['article', 'indice']),
('Agriculture', 'agriculture', 'Secteur agricole et commodités', '#F59E0B', 'Wheat', ARRAY['article', 'podcast', 'indice']),
('Industrie Minière', 'industrie-miniere', 'Mines et ressources naturelles', '#EF4444', 'Pickaxe', ARRAY['article', 'podcast', 'indice']),
('Technologie', 'technologie', 'Fintech et innovation', '#06B6D4', 'Smartphone', ARRAY['article', 'podcast']),
('Investissement', 'investissement', 'Opportunités d''investissement', '#84CC16', 'PiggyBank', ARRAY['article', 'podcast'])
ON CONFLICT (slug) DO NOTHING;

-- Ajouter la colonne category_id à la table contents
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Mettre à jour les enregistrements existants en convertissant category (text) vers category_id (UUID)
UPDATE contents 
SET category_id = cc.id
FROM content_categories cc
WHERE contents.category = cc.slug
AND contents.category_id IS NULL;

-- Pour les enregistrements sans correspondance, utiliser la catégorie "Économie" par défaut
UPDATE contents 
SET category_id = (SELECT id FROM content_categories WHERE slug = 'economie' LIMIT 1)
WHERE category_id IS NULL;

-- Créer une contrainte de clé étrangère vers content_categories
ALTER TABLE contents 
ADD CONSTRAINT fk_contents_category_id 
FOREIGN KEY (category_id) REFERENCES content_categories(id);

-- Rendre la colonne NOT NULL après avoir mis à jour les données
ALTER TABLE contents 
ALTER COLUMN category_id SET NOT NULL;

-- Créer l'index sur category_id
CREATE INDEX IF NOT EXISTS idx_contents_category_id ON contents(category_id);

-- Optionnel: Supprimer l'ancienne colonne category (text) après vérification
-- ALTER TABLE contents DROP COLUMN category;
