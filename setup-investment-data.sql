-- =====================================================
-- SCRIPT DE CONFIGURATION DES DONNÉES D'INVESTISSEMENT
-- =====================================================
-- Ce script crée les tables et données pour le système d'investissement d'Amani Finance
-- Tables: investment_categories, investment_opportunities, investment_metrics, market_trends

-- =====================================================
-- 1. CRÉATION DES TABLES
-- =====================================================

-- Table des catégories d'investissement
CREATE TABLE IF NOT EXISTS public.investment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'TrendingUp',
    color VARCHAR(20) DEFAULT '#373B3A',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des opportunités d'investissement
CREATE TABLE IF NOT EXISTS public.investment_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Faible', 'Modéré', 'Élevé')),
    expected_return_min DECIMAL(5,2) NOT NULL,
    expected_return_max DECIMAL(5,2) NOT NULL,
    min_investment_amount DECIMAL(12,2) NOT NULL,
    min_investment_unit VARCHAR(10) DEFAULT '€',
    time_horizon_min INTEGER NOT NULL, -- en années
    time_horizon_max INTEGER NOT NULL, -- en années
    status VARCHAR(20) NOT NULL DEFAULT 'Ouvert' CHECK (status IN ('Ouvert', 'Bientôt', 'Fermé')),
    funded_percentage INTEGER DEFAULT 0 CHECK (funded_percentage >= 0 AND funded_percentage <= 100),
    image_url TEXT,
    highlights TEXT[], -- Array de points clés
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des métriques d'investissement (statistiques du marché)
CREATE TABLE IF NOT EXISTS public.investment_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value VARCHAR(50) NOT NULL,
    metric_unit VARCHAR(20),
    change_value VARCHAR(20),
    change_description VARCHAR(100),
    description VARCHAR(200),
    icon_name VARCHAR(50) DEFAULT 'DollarSign',
    color VARCHAR(50) DEFAULT 'text-green-600',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tendances du marché
CREATE TABLE IF NOT EXISTS public.market_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    growth_percentage VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'TrendingUp',
    color VARCHAR(50) DEFAULT 'text-green-600',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CONFIGURATION DES POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.investment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (tous les utilisateurs peuvent lire)
CREATE POLICY "Allow public read access on investment_categories" ON public.investment_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on investment_opportunities" ON public.investment_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on investment_metrics" ON public.investment_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access on market_trends" ON public.market_trends FOR SELECT USING (true);

-- Politiques d'écriture pour les utilisateurs authentifiés (admin)
CREATE POLICY "Allow authenticated users to manage investment_categories" ON public.investment_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage investment_opportunities" ON public.investment_opportunities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage investment_metrics" ON public.investment_metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage market_trends" ON public.market_trends FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. FONCTIONS DE MISE À JOUR AUTOMATIQUE DES TIMESTAMPS
-- =====================================================

-- Fonction générique pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_investment_categories_updated_at
    BEFORE UPDATE ON public.investment_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_opportunities_updated_at
    BEFORE UPDATE ON public.investment_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_metrics_updated_at
    BEFORE UPDATE ON public.investment_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_trends_updated_at
    BEFORE UPDATE ON public.market_trends
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. INSERTION DES DONNÉES DE TEST
-- =====================================================

-- Insertion des catégories d'investissement
INSERT INTO public.investment_categories (name, description, icon_name, color, display_order) VALUES
('Technologie', 'Investissements dans les startups tech et l''innovation numérique', 'Zap', '#3B82F6', 1),
('Énergie Renouvelable', 'Projets d''énergie verte et développement durable', 'Zap', '#10B981', 2),
('Agriculture', 'Agriculture moderne et technologies agricoles', 'Leaf', '#059669', 3),
('Santé', 'Innovations médicales et technologies de santé', 'Heart', '#DC2626', 4),
('Services Financiers', 'FinTech et services financiers innovants', 'DollarSign', '#7C3AED', 5),
('Infrastructure', 'Développement d''infrastructures et transport', 'Building', '#F59E0B', 6)
ON CONFLICT (name) DO NOTHING;

-- Insertion des métriques d'investissement
INSERT INTO public.investment_metrics (metric_name, metric_value, metric_unit, change_value, change_description, description, icon_name, color, display_order) VALUES
('Capitaux Investis', '125', 'M€', '+15.3%', 'Ce trimestre', 'Total des capitaux investis dans la région', 'DollarSign', 'text-green-600', 1),
('Rendement Moyen', '12.8', '%', '+2.1%', 'Performance annuelle', 'Rendement moyen des investissements', 'BarChart3', 'text-blue-600', 2),
('Projets Financés', '384', '', '+28', 'Nouveaux projets', 'Nombre total de projets financés', 'Globe', 'text-purple-600', 3),
('Investisseurs Actifs', '2450', '', '+185', 'Investisseurs engagés', 'Nombre d''investisseurs actifs sur la plateforme', 'Users', 'text-orange-600', 4);

-- Insertion des tendances du marché
INSERT INTO public.market_trends (title, growth_percentage, description, display_order) VALUES
('Intelligence Artificielle', '+45%', 'L''IA transforme les industries africaines', 1),
('Énergie Verte', '+38%', 'Transition énergétique accélérée', 2),
('FinTech', '+42%', 'Innovation financière en croissance', 3),
('E-commerce', '+35%', 'Commerce électronique en expansion', 4);

-- Insertion des opportunités d'investissement
INSERT INTO public.investment_opportunities (
    title, category_name, description, risk_level, expected_return_min, expected_return_max,
    min_investment_amount, min_investment_unit, time_horizon_min, time_horizon_max,
    status, funded_percentage, image_url, highlights, is_featured, display_order
) VALUES
(
    'FinTech Revolution : Solutions de paiement mobile en Afrique',
    'Technologie',
    'Investissement dans les solutions de paiement mobile qui révolutionnent le secteur financier africain avec une croissance de 40% par an.',
    'Modéré',
    18.0, 25.0,
    50000, '€',
    3, 5,
    'Ouvert', 65,
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    ARRAY['Marché en croissance de 40%', 'Technologie éprouvée', 'Équipe expérimentée'],
    true, 1
),
(
    'Agriculture Durable : Fermes Intelligentes et IoT',
    'Agriculture',
    'Modernisation de l''agriculture africaine avec des technologies IoT pour améliorer les rendements et la durabilité.',
    'Faible',
    12.0, 18.0,
    25000, '€',
    2, 4,
    'Ouvert', 45,
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop',
    ARRAY['Impact social positif', 'Technologie innovante', 'Marché stable'],
    true, 2
),
(
    'Énergie Solaire : Parcs Photovoltaïques Communautaires',
    'Énergie Renouvelable',
    'Développement de parcs solaires communautaires pour fournir une énergie propre et abordable aux zones rurales.',
    'Faible',
    15.0, 20.0,
    100000, '€',
    5, 7,
    'Bientôt', 0,
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    ARRAY['Énergie renouvelable', 'Impact environnemental', 'Revenus stables'],
    true, 3
),
(
    'E-commerce B2B : Plateforme de Commerce Interentreprises',
    'Technologie',
    'Plateforme digitale connectant les entreprises africaines pour faciliter le commerce interentreprises à l''échelle continentale.',
    'Élevé',
    25.0, 35.0,
    75000, '€',
    3, 6,
    'Fermé', 100,
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop',
    ARRAY['Marché B2B en expansion', 'Technologie scalable', 'Potentiel élevé'],
    false, 4
),
(
    'HealthTech : Télémédecine pour l''Afrique Rurale',
    'Santé',
    'Plateforme de télémédecine pour améliorer l''accès aux soins de santé dans les zones rurales africaines.',
    'Modéré',
    20.0, 28.0,
    40000, '€',
    4, 6,
    'Ouvert', 30,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    ARRAY['Impact social fort', 'Marché sous-exploité', 'Technologie accessible'],
    true, 5
),
(
    'Infrastructure Verte : Transport Électrique Urbain',
    'Infrastructure',
    'Développement de solutions de transport électrique pour les villes africaines en croissance.',
    'Modéré',
    16.0, 22.0,
    150000, '€',
    6, 8,
    'Ouvert', 20,
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
    ARRAY['Urbanisation croissante', 'Transition écologique', 'Soutien gouvernemental'],
    false, 6
);

-- =====================================================
-- 5. CRÉATION D'INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_investment_categories_active ON public.investment_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_investment_opportunities_active ON public.investment_opportunities(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_investment_opportunities_featured ON public.investment_opportunities(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_investment_opportunities_status ON public.investment_opportunities(status, is_active);
CREATE INDEX IF NOT EXISTS idx_investment_metrics_active ON public.investment_metrics(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_market_trends_active ON public.market_trends(is_active, display_order);

-- =====================================================
-- SCRIPT TERMINÉ
-- =====================================================

-- Affichage du résumé
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURATION DES DONNÉES D''INVESTISSEMENT TERMINÉE ===';
    RAISE NOTICE 'Tables créées:';
    RAISE NOTICE '- investment_categories (% lignes)', (SELECT COUNT(*) FROM public.investment_categories);
    RAISE NOTICE '- investment_opportunities (% lignes)', (SELECT COUNT(*) FROM public.investment_opportunities);
    RAISE NOTICE '- investment_metrics (% lignes)', (SELECT COUNT(*) FROM public.investment_metrics);
    RAISE NOTICE '- market_trends (% lignes)', (SELECT COUNT(*) FROM public.market_trends);
    RAISE NOTICE '';
    RAISE NOTICE 'APIs disponibles:';
    RAISE NOTICE '- /api/investment-data/categories';
    RAISE NOTICE '- /api/investment-data/opportunities';
    RAISE NOTICE '- /api/investment-data/metrics';
    RAISE NOTICE '- /api/investment-data/trends';
    RAISE NOTICE '';
    RAISE NOTICE 'Prochaines étapes:';
    RAISE NOTICE '1. Créer le hook useInvestmentData.ts';
    RAISE NOTICE '2. Créer les routes API investment-data.ts';
    RAISE NOTICE '3. Mettre à jour la page Investissement.tsx';
    RAISE NOTICE '4. Créer le dashboard de gestion';
END $$;
