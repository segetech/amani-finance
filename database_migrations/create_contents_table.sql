-- Migration pour créer la table contents avec toutes les colonnes nécessaires
-- À exécuter dans Supabase SQL Editor

-- Créer les types ENUM si ils n'existent pas
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('article', 'podcast', 'indice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Créer la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer la table contents
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type content_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  content TEXT,
  
  -- STATUT & MÉTADONNÉES
  status content_status DEFAULT 'draft'::content_status,
  category_id UUID NOT NULL REFERENCES categories(id),
  author_id UUID NOT NULL REFERENCES profiles(id),
  country VARCHAR(100) DEFAULT 'mali',
  tags TEXT[] DEFAULT '{}',
  
  -- SEO AUTOMATIQUE
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  featured_image TEXT,
  featured_image_alt VARCHAR(200),
  
  -- DATES
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- MÉTRIQUES
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  -- DONNÉES SPÉCIFIQUES PAR TYPE (JSONB)
  article_data JSONB DEFAULT '{}',
  podcast_data JSONB DEFAULT '{}',
  indice_data JSONB DEFAULT '{}'
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category_id);
CREATE INDEX IF NOT EXISTS idx_contents_author ON contents(author_id);
CREATE INDEX IF NOT EXISTS idx_contents_country ON contents(country);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);
CREATE INDEX IF NOT EXISTS idx_contents_published_at ON contents(published_at);
CREATE INDEX IF NOT EXISTS idx_contents_tags ON contents USING GIN(tags);

-- Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_contents_updated_at ON contents;
CREATE TRIGGER update_contents_updated_at 
  BEFORE UPDATE ON contents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour lecture publique des contenus publiés
CREATE POLICY "Public can view published contents" ON contents
  FOR SELECT USING (status = 'published');

-- Politique RLS pour les auteurs (peuvent voir et modifier leurs propres contenus)
CREATE POLICY "Authors can manage their own contents" ON contents
  FOR ALL USING (auth.uid() = author_id);

-- Politique RLS pour les admins (peuvent tout faire)
CREATE POLICY "Admins can manage all contents" ON contents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
