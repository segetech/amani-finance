-- Migration pour ajouter la colonne category_id à la table contents existante
-- À exécuter dans Supabase SQL Editor

-- Vérifier si la table categories existe, sinon la créer
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  content_types TEXT[] DEFAULT '{article,podcast,indice}',
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les catégories par défaut si elles n'existent pas
INSERT INTO categories (name, slug, description, color, icon, content_types) 
VALUES
('Économie', 'economie', 'Actualités économiques africaines', '#3B82F6', 'TrendingUp', '{article,podcast,indice}'),
('Marchés Financiers', 'marches-financiers', 'BRVM et marchés financiers', '#10B981', 'BarChart3', '{article,podcast,indice}'),
('Politique Monétaire', 'politique-monetaire', 'Décisions des banques centrales', '#8B5CF6', 'Banknote', '{article,indice}'),
('Agriculture', 'agriculture', 'Secteur agricole et commodités', '#F59E0B', 'Wheat', '{article,podcast,indice}'),
('Industrie Minière', 'industrie-miniere', 'Mines et ressources naturelles', '#EF4444', 'Pickaxe', '{article,podcast,indice}'),
('Technologie', 'technologie', 'Fintech et innovation', '#06B6D4', 'Smartphone', '{article,podcast}'),
('Investissement', 'investissement', 'Opportunités d''investissement', '#84CC16', 'PiggyBank', '{article,podcast}')
ON CONFLICT (slug) DO NOTHING;

-- Ajouter la colonne category_id à la table contents si elle n'existe pas
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Créer une contrainte de clé étrangère vers categories
ALTER TABLE contents 
ADD CONSTRAINT fk_contents_category 
FOREIGN KEY (category_id) REFERENCES categories(id);

-- Mettre à jour les enregistrements existants avec une catégorie par défaut
UPDATE contents 
SET category_id = (SELECT id FROM categories WHERE slug = 'economie' LIMIT 1)
WHERE category_id IS NULL;

-- Rendre la colonne NOT NULL après avoir mis à jour les données
ALTER TABLE contents 
ALTER COLUMN category_id SET NOT NULL;

-- Créer l'index sur category_id
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category_id);
