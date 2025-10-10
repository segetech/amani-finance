-- Script pour créer les tables de données industrielles
-- Exécuter dans Supabase SQL Editor

-- Table pour les secteurs industriels
CREATE TABLE IF NOT EXISTS public.industrial_sectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50) DEFAULT 'Factory',
  color VARCHAR(20) DEFAULT '#373B3A',
  production_value DECIMAL(15,2),
  production_unit VARCHAR(20) DEFAULT 'M€',
  growth_rate DECIMAL(5,2),
  employment_count INTEGER,
  investment_amount DECIMAL(15,2),
  investment_unit VARCHAR(20) DEFAULT 'M€',
  efficiency_improvement DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les entreprises industrielles
CREATE TABLE IF NOT EXISTS public.industrial_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  sector_id UUID REFERENCES public.industrial_sectors(id) ON DELETE SET NULL,
  sector_name VARCHAR(100),
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  founded_year INTEGER,
  employee_count INTEGER,
  revenue_amount DECIMAL(15,2),
  revenue_unit VARCHAR(20) DEFAULT 'M€',
  growth_rate DECIMAL(5,2),
  market_cap DECIMAL(15,2),
  market_cap_unit VARCHAR(20) DEFAULT 'M€',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les métriques industrielles globales
CREATE TABLE IF NOT EXISTS public.industrial_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value VARCHAR(50) NOT NULL,
  metric_unit VARCHAR(20),
  description TEXT,
  icon_name VARCHAR(50) DEFAULT 'Factory',
  color VARCHAR(20) DEFAULT 'text-green-600',
  change_value VARCHAR(20),
  change_description VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des données de test pour les secteurs industriels
INSERT INTO public.industrial_sectors (name, description, icon_name, color, production_value, growth_rate, employment_count, investment_amount, efficiency_improvement, display_order) VALUES
('Manufacture', 'Secteur manufacturier incluant la production de biens industriels', 'Factory', '#2563eb', 2800.00, 12.5, 45000, 125.0, 15.3, 1),
('Énergie', 'Production et distribution d''énergie, énergies renouvelables', 'Zap', '#059669', 1850.00, 23.2, 28000, 89.5, 28.7, 2),
('Automobile', 'Construction automobile et équipements', 'Car', '#dc2626', 3200.00, 8.9, 52000, 156.8, 12.1, 3),
('Aérospatiale', 'Industrie aéronautique et spatiale', 'Plane', '#7c3aed', 1200.00, 18.4, 15000, 78.2, 22.5, 4),
('Pharmaceutique', 'Industrie pharmaceutique et biotechnologies', 'Pill', '#ea580c', 950.00, 25.6, 18500, 95.3, 19.8, 5),
('Agroalimentaire', 'Transformation et production alimentaire', 'Wheat', '#16a34a', 2100.00, 14.7, 38000, 67.4, 16.2, 6)
ON CONFLICT DO NOTHING;

-- Insérer des données de test pour les entreprises
INSERT INTO public.industrial_companies (name, sector_name, description, country, city, founded_year, employee_count, revenue_amount, growth_rate, market_cap, is_featured, display_order) VALUES
('TechCorp Industries', 'Technologie', 'Leader en solutions industrielles innovantes', 'Côte d''Ivoire', 'Abidjan', 2015, 2500, 180.5, 18.2, 450.0, true, 1),
('GreenEnergy Solutions', 'Énergie', 'Spécialiste en énergies renouvelables', 'Sénégal', 'Dakar', 2018, 1200, 95.3, 25.1, 280.0, true, 2),
('AutoMotive Plus', 'Automobile', 'Assemblage et distribution automobile', 'Ghana', 'Accra', 2012, 3800, 245.7, 15.4, 520.0, true, 3),
('PharmaCare Africa', 'Pharmaceutique', 'Production pharmaceutique locale', 'Nigeria', 'Lagos', 2010, 1800, 125.8, 22.3, 380.0, true, 4),
('AgroTech Mali', 'Agroalimentaire', 'Transformation agroalimentaire moderne', 'Mali', 'Bamako', 2016, 950, 67.2, 19.8, 150.0, false, 5),
('Solar Power West Africa', 'Énergie', 'Installation de systèmes solaires industriels', 'Burkina Faso', 'Ouagadougou', 2019, 680, 42.1, 31.5, 95.0, false, 6)
ON CONFLICT DO NOTHING;

-- Insérer des métriques industrielles globales
INSERT INTO public.industrial_metrics (metric_name, metric_value, metric_unit, description, icon_name, color, change_value, change_description, display_order) VALUES
('Production Industrielle', '+12.5', '%', 'Croissance annuelle', 'Factory', 'text-green-600', '+2.3%', 'vs trimestre précédent', 1),
('Emplois Créés', '45,000', '', 'Nouveaux postes', 'Users', 'text-blue-600', '+8,500', 'ce trimestre', 2),
('Investissements', '€2.8', 'Mds', 'Capital investi', 'DollarSign', 'text-purple-600', '+15.3%', 'croissance annuelle', 3),
('Efficacité Énergétique', '+23', '%', 'Amélioration', 'Zap', 'text-yellow-600', '+5%', 'vs année précédente', 4)
ON CONFLICT DO NOTHING;

-- Activer RLS (Row Level Security)
ALTER TABLE public.industrial_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industrial_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industrial_metrics ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Lecture publique des secteurs industriels" 
  ON public.industrial_sectors FOR SELECT 
  USING (true);

CREATE POLICY "Lecture publique des entreprises industrielles" 
  ON public.industrial_companies FOR SELECT 
  USING (true);

CREATE POLICY "Lecture publique des métriques industrielles" 
  ON public.industrial_metrics FOR SELECT 
  USING (true);

-- Politiques de modification pour utilisateurs authentifiés
CREATE POLICY "Modification des secteurs par utilisateurs authentifiés" 
  ON public.industrial_sectors FOR ALL 
  USING (true);

CREATE POLICY "Modification des entreprises par utilisateurs authentifiés" 
  ON public.industrial_companies FOR ALL 
  USING (true);

CREATE POLICY "Modification des métriques par utilisateurs authentifiés" 
  ON public.industrial_metrics FOR ALL 
  USING (true);

-- Fonctions pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_industrial_sectors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_industrial_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_industrial_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_industrial_sectors_updated_at
  BEFORE UPDATE ON public.industrial_sectors
  FOR EACH ROW
  EXECUTE FUNCTION update_industrial_sectors_updated_at();

CREATE TRIGGER update_industrial_companies_updated_at
  BEFORE UPDATE ON public.industrial_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_industrial_companies_updated_at();

CREATE TRIGGER update_industrial_metrics_updated_at
  BEFORE UPDATE ON public.industrial_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_industrial_metrics_updated_at();
