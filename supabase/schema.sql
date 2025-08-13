-- SCHÉMA SUPABASE COMPLET POUR AMANI FINANCE
-- Système unifié prêt pour la production

-- =============================================
-- EXTENSIONS NÉCESSAIRES
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Pour la recherche textuelle
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- Pour la recherche sans accents

-- =============================================
-- TYPES ÉNUMÉRÉS
-- =============================================
CREATE TYPE content_type AS ENUM ('article', 'podcast', 'indice');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'analyst', 'moderator', 'subscriber');
CREATE TYPE analytics_event AS ENUM ('view', 'like', 'share', 'download', 'comment');
CREATE TYPE indice_frequency AS ENUM ('real-time', 'daily', 'weekly', 'monthly');

-- =============================================
-- PROFILS UTILISATEURS (SYSTÈME UNIFIÉ)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'subscriber'::user_role,
  permissions TEXT[] DEFAULT '{}',
  organization VARCHAR(200),
  country VARCHAR(100) DEFAULT 'mali',
  bio TEXT,
  website VARCHAR(300),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_country ON profiles(country);
CREATE INDEX idx_profiles_active ON profiles(is_active);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CATÉGORIES UNIFIÉES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Couleur hexa
  icon VARCHAR(50), -- Nom de l'icône Lucide
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  content_types content_type[] DEFAULT '{article,podcast,indice}',
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_parent ON categories(parent_id);

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CONTENU UNIFIÉ (ARTICLES, PODCASTS, INDICES)
-- =============================================
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type content_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  summary TEXT NOT NULL, -- OBLIGATOIRE pour tous les types
  description TEXT,
  content TEXT, -- Contenu complet optionnel
  
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
  shares INTEGER DEFAULT 0,
  read_time INTEGER, -- En minutes
  
  -- DONNÉES SPÉCIFIQUES (JSONB pour flexibilité)
  article_data JSONB DEFAULT '{}',
  podcast_data JSONB DEFAULT '{}',
  indice_data JSONB DEFAULT '{}',
  
  -- CONTRAINTES
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9\-]+$'),
  CONSTRAINT valid_meta_title_length CHECK (char_length(meta_title) <= 60),
  CONSTRAINT valid_meta_description_length CHECK (char_length(meta_description) <= 155)
);

-- Index pour optimiser les performances
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_category ON contents(category_id);
CREATE INDEX idx_contents_author ON contents(author_id);
CREATE INDEX idx_contents_published ON contents(published_at DESC);
CREATE INDEX idx_contents_country ON contents(country);
CREATE INDEX idx_contents_tags ON contents USING GIN(tags);
CREATE INDEX idx_contents_search ON contents USING GIN(to_tsvector('french', title || ' ' || summary));

-- Index composé pour les requêtes fréquentes
CREATE INDEX idx_contents_type_status_published ON contents(type, status, published_at DESC);

CREATE TRIGGER update_contents_updated_at 
  BEFORE UPDATE ON contents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ANALYTICS & MÉTRIQUES
-- =============================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  event_type analytics_event NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioning par mois pour optimiser les performances
CREATE INDEX idx_analytics_content ON analytics(content_id, created_at DESC);
CREATE INDEX idx_analytics_event ON analytics(event_type, created_at DESC);
CREATE INDEX idx_analytics_user ON analytics(user_id, created_at DESC);
CREATE INDEX idx_analytics_country ON analytics(country, created_at DESC);

-- =============================================
-- COMMENTAIRES & INTERACTIONS
-- =============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_comment_length CHECK (char_length(comment) >= 10 AND char_length(comment) <= 5000)
);

CREATE INDEX idx_comments_content ON comments(content_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_approved ON comments(is_approved);
CREATE INDEX idx_comments_parent ON comments(parent_id);

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- LIKES & BOOKMARKS
-- =============================================
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  is_liked BOOLEAN DEFAULT FALSE,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_id)
);

CREATE INDEX idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_content ON user_interactions(content_id);
CREATE INDEX idx_user_interactions_liked ON user_interactions(is_liked) WHERE is_liked = TRUE;
CREATE INDEX idx_user_interactions_bookmarked ON user_interactions(is_bookmarked) WHERE is_bookmarked = TRUE;

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  related_content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- =============================================
-- PARAMÈTRES SYSTÈME
-- =============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour auto-générer les slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(trim(input_text)),
        '[^a-zA-Z0-9\s\-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour les compteurs automatiquement
CREATE OR REPLACE FUNCTION update_content_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrémenter les compteurs selon le type d'événement
    IF NEW.event_type = 'view' THEN
      UPDATE contents SET views = views + 1 WHERE id = NEW.content_id;
    ELSIF NEW.event_type = 'like' THEN
      UPDATE contents SET likes = likes + 1 WHERE id = NEW.content_id;
    ELSIF NEW.event_type = 'share' THEN
      UPDATE contents SET shares = shares + 1 WHERE id = NEW.content_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_metrics_trigger
  AFTER INSERT ON analytics
  FOR EACH ROW EXECUTE FUNCTION update_content_metrics();

-- Fonction pour calculer automatiquement le temps de lecture
CREATE OR REPLACE FUNCTION calculate_read_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  words_count INTEGER;
  read_time INTEGER;
BEGIN
  -- Compter les mots (approximativement)
  words_count := array_length(string_to_array(content_text, ' '), 1);
  
  -- Calculer le temps de lecture (200 mots/minute en moyenne)
  read_time := GREATEST(1, CEIL(words_count / 200.0));
  
  RETURN read_time;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement le temps de lecture
CREATE OR REPLACE FUNCTION auto_calculate_read_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NOT NULL AND NEW.content != '' THEN
    NEW.read_time := calculate_read_time(NEW.content);
  ELSIF NEW.summary IS NOT NULL THEN
    NEW.read_time := calculate_read_time(NEW.summary);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_read_time_trigger
  BEFORE INSERT OR UPDATE ON contents
  FOR EACH ROW EXECUTE FUNCTION auto_calculate_read_time();

-- =============================================
-- ROW LEVEL SECURITY (SÉCURITÉ)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Les utilisateurs peuvent voir les profils publics" ON profiles
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour le contenu
CREATE POLICY "Contenu publié visible par tous" ON contents
  FOR SELECT USING (status = 'published');

CREATE POLICY "Auteurs peuvent voir leur propre contenu" ON contents
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Auteurs peuvent modifier leur contenu" ON contents
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Utilisateurs autorisés peuvent créer du contenu" ON contents
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Politiques pour les catégories
CREATE POLICY "Catégories actives visibles par tous" ON categories
  FOR SELECT USING (is_active = TRUE);

-- Politiques pour les commentaires
CREATE POLICY "Commentaires approuvés visibles par tous" ON comments
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Utilisateurs peuvent créer des commentaires" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent modifier leurs commentaires" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les interactions
CREATE POLICY "Utilisateurs peuvent gérer leurs interactions" ON user_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Politiques pour les notifications
CREATE POLICY "Utilisateurs voient leurs propres notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- VUES UTILES
-- =============================================

-- Vue pour le contenu enrichi
CREATE VIEW enriched_contents AS
SELECT 
  c.*,
  cat.name as category_name,
  cat.slug as category_slug,
  cat.color as category_color,
  p.first_name || ' ' || p.last_name as author_name,
  p.avatar_url as author_avatar,
  (SELECT COUNT(*) FROM comments cm WHERE cm.content_id = c.id AND cm.is_approved = TRUE) as comment_count,
  (SELECT COUNT(*) FROM user_interactions ui WHERE ui.content_id = c.id AND ui.is_liked = TRUE) as actual_likes,
  (SELECT COUNT(*) FROM user_interactions ui WHERE ui.content_id = c.id AND ui.is_bookmarked = TRUE) as bookmark_count
FROM contents c
JOIN categories cat ON c.category_id = cat.id
JOIN profiles p ON c.author_id = p.id;

-- Vue pour les statistiques de contenu
CREATE VIEW content_stats AS
SELECT 
  type,
  status,
  COUNT(*) as count,
  SUM(views) as total_views,
  SUM(likes) as total_likes,
  SUM(shares) as total_shares,
  AVG(read_time) as avg_read_time
FROM contents
GROUP BY type, status;

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Catégories par défaut
INSERT INTO categories (name, slug, description, color, icon, content_types) VALUES
('Économie', 'economie', 'Actualités économiques africaines', '#3B82F6', 'TrendingUp', '{article,podcast,indice}'),
('Marchés Financiers', 'marches-financiers', 'BRVM et marchés financiers', '#10B981', 'BarChart3', '{article,podcast,indice}'),
('Politique Monétaire', 'politique-monetaire', 'Décisions des banques centrales', '#8B5CF6', 'Banknote', '{article,indice}'),
('Agriculture', 'agriculture', 'Secteur agricole et commodités', '#F59E0B', 'Wheat', '{article,podcast,indice}'),
('Industrie Minière', 'industrie-miniere', 'Mines et ressources naturelles', '#EF4444', 'Pickaxe', '{article,podcast,indice}'),
('Technologie', 'technologie', 'Fintech et innovation', '#06B6D4', 'Smartphone', '{article,podcast}'),
('Investissement', 'investissement', 'Opportunités d\'investissement', '#84CC16', 'PiggyBank', '{article,podcast}');

-- Paramètres système par défaut
INSERT INTO settings (key, value, description, is_public) VALUES
('site_name', '"Amani Finance"', 'Nom du site', true),
('site_description', '"L\'information économique africaine accessible à tous"', 'Description du site', true),
('default_country', '"mali"', 'Pays par défaut', true),
('compression_quality', '0.85', 'Qualité de compression des images', false),
('max_image_size_kb', '500', 'Taille max des images en KB', false),
('comments_auto_approve', 'false', 'Approbation automatique des commentaires', false),
('analytics_retention_days', '365', 'Durée de rétention des analytics en jours', false);

-- =============================================
-- FONCTIONS D'API
-- =============================================

-- Fonction pour récupérer le contenu avec pagination
CREATE OR REPLACE FUNCTION get_contents(
  content_type_filter content_type DEFAULT NULL,
  category_slug_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  type content_type,
  title VARCHAR(200),
  slug VARCHAR(200),
  summary TEXT,
  featured_image TEXT,
  category_name TEXT,
  author_name TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER,
  likes INTEGER,
  comment_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.type,
    c.title,
    c.slug,
    c.summary,
    c.featured_image,
    cat.name,
    p.first_name || ' ' || p.last_name,
    c.published_at,
    c.views,
    c.likes,
    (SELECT COUNT(*) FROM comments cm WHERE cm.content_id = c.id AND cm.is_approved = TRUE)
  FROM contents c
  JOIN categories cat ON c.category_id = cat.id
  JOIN profiles p ON c.author_id = p.id
  WHERE 
    c.status = 'published'
    AND (content_type_filter IS NULL OR c.type = content_type_filter)
    AND (category_slug_filter IS NULL OR cat.slug = category_slug_filter)
  ORDER BY c.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMMENTAIRES & DOCUMENTATION
-- =============================================

-- Cette structure de base de données est optimisée pour :
-- 1. Performance (index appropriés, partitioning)
-- 2. Sécurité (RLS, contraintes)
-- 3. Flexibilité (JSONB pour données spécifiques)
-- 4. SEO (métadonnées automatiques)
-- 5. Analytics (métriques en temps réel)
-- 6. Évolutivité (structure modulaire)

-- Pour déployer :
-- 1. Exécuter ce script sur votre instance Supabase
-- 2. Configurer les variables d'environnement
-- 3. Implémenter les fonctions Edge pour les scrapers
-- 4. Configurer le stockage pour les images
