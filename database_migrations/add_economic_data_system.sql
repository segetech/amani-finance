-- 📊 SYSTÈME DE DONNÉES ÉCONOMIQUES
-- Tables pour gérer les données économiques des pays et les métriques régionales

-- Table pour les données économiques par pays
CREATE TABLE public.economic_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  flag_emoji varchar(10) NOT NULL,
  currency varchar(20) NOT NULL DEFAULT 'FCFA',
  population varchar(20) NOT NULL,
  gdp_growth_rate decimal(5,2) NOT NULL, -- Ex: 5.20 pour +5.2%
  inflation_rate decimal(5,2) NOT NULL, -- Ex: 2.10 pour 2.1%
  unemployment_rate decimal(5,2) NOT NULL, -- Ex: 8.40 pour 8.4%
  gdp_per_capita integer NOT NULL, -- En USD
  main_sectors text[] NOT NULL DEFAULT '{}', -- Array de secteurs
  description text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table pour les métriques économiques régionales (header)
CREATE TABLE public.regional_economic_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name varchar(100) NOT NULL UNIQUE,
  metric_value varchar(50) NOT NULL,
  metric_unit varchar(20),
  icon_name varchar(50) NOT NULL, -- Nom de l'icône Lucide React
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_economic_countries_active ON public.economic_countries(is_active);
CREATE INDEX idx_economic_countries_order ON public.economic_countries(display_order);
CREATE INDEX idx_regional_metrics_active ON public.regional_economic_metrics(is_active);
CREATE INDEX idx_regional_metrics_order ON public.regional_economic_metrics(display_order);

-- Trigger pour updated_at sur economic_countries
CREATE OR REPLACE FUNCTION update_economic_countries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_economic_countries_updated_at
  BEFORE UPDATE ON public.economic_countries
  FOR EACH ROW
  EXECUTE FUNCTION update_economic_countries_updated_at();

-- Trigger pour updated_at sur regional_economic_metrics
CREATE OR REPLACE FUNCTION update_regional_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_regional_metrics_updated_at
  BEFORE UPDATE ON public.regional_economic_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_regional_metrics_updated_at();

-- Activer Row Level Security
ALTER TABLE public.economic_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_economic_metrics ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour economic_countries
CREATE POLICY "Les données économiques des pays sont visibles par tous"
  ON public.economic_countries FOR SELECT
  USING (true);

CREATE POLICY "Seuls les administrateurs peuvent modifier les données économiques des pays"
  ON public.economic_countries FOR ALL
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Politiques RLS pour regional_economic_metrics
CREATE POLICY "Les métriques régionales sont visibles par tous"
  ON public.regional_economic_metrics FOR SELECT
  USING (true);

CREATE POLICY "Seuls les administrateurs peuvent modifier les métriques régionales"
  ON public.regional_economic_metrics FOR ALL
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Insertion des données de test pour les pays
INSERT INTO public.economic_countries (
  name, flag_emoji, currency, population, gdp_growth_rate, inflation_rate, 
  unemployment_rate, gdp_per_capita, main_sectors, description, display_order
) VALUES 
(
  'Mali',
  '🇲🇱',
  'FCFA',
  '21.9M',
  5.20,
  2.10,
  8.40,
  875,
  ARRAY['Agriculture', 'Mines', 'Services'],
  'République du Mali - Économie basée sur l''agriculture et l''extraction minière',
  1
),
(
  'Burkina Faso',
  '🇧🇫',
  'FCFA',
  '22.1M',
  4.80,
  1.90,
  6.20,
  790,
  ARRAY['Agriculture', 'Mines', 'Élevage'],
  'Burkina Faso - Économie agricole avec un secteur minier en développement',
  2
),
(
  'Niger',
  '🇳🇪',
  'FCFA',
  '25.3M',
  6.10,
  2.80,
  7.30,
  650,
  ARRAY['Uranium', 'Agriculture', 'Élevage'],
  'République du Niger - Économie basée sur l''uranium et l''agriculture',
  3
),
(
  'Tchad',
  '🇹🇩',
  'FCFA',
  '17.2M',
  3.90,
  3.20,
  9.10,
  720,
  ARRAY['Pétrole', 'Agriculture', 'Coton'],
  'République du Tchad - Économie pétrolière avec un secteur agricole important',
  4
),
(
  'Côte d''Ivoire',
  '🇨🇮',
  'FCFA',
  '27.5M',
  7.20,
  2.40,
  5.80,
  2280,
  ARRAY['Cacao', 'Agriculture', 'Services'],
  'République de Côte d''Ivoire - Premier producteur mondial de cacao',
  5
),
(
  'Sénégal',
  '🇸🇳',
  'FCFA',
  '17.2M',
  5.30,
  1.80,
  6.90,
  1430,
  ARRAY['Services', 'Agriculture', 'Pêche'],
  'République du Sénégal - Économie diversifiée avec un secteur tertiaire développé',
  6
);

-- Insertion des métriques régionales pour le header
INSERT INTO public.regional_economic_metrics (
  metric_name, metric_value, metric_unit, icon_name, display_order, description
) VALUES 
(
  'Croissance régionale',
  '+5.2',
  '%',
  'TrendingUp',
  1,
  'Taux de croissance économique moyen de la région UEMOA'
),
(
  'PIB régional',
  '180B',
  'USD',
  'DollarSign',
  2,
  'Produit Intérieur Brut total de la région en milliards de dollars USD'
),
(
  'Population totale',
  '86M',
  'habitants',
  'Users',
  3,
  'Population totale des pays membres de l''UEMOA'
),
(
  'Inflation moyenne',
  '2.3',
  '%',
  'Activity',
  4,
  'Taux d''inflation moyen pondéré de la région'
),
(
  'Investissements directs',
  '12.5B',
  'USD',
  'Building',
  5,
  'Investissements directs étrangers dans la région'
);

-- Commentaires pour la documentation
COMMENT ON TABLE public.economic_countries IS 'Données économiques des pays de la région';
COMMENT ON TABLE public.regional_economic_metrics IS 'Métriques économiques régionales affichées dans le header';

COMMENT ON COLUMN public.economic_countries.gdp_growth_rate IS 'Taux de croissance du PIB en pourcentage (ex: 5.20 pour +5.2%)';
COMMENT ON COLUMN public.economic_countries.inflation_rate IS 'Taux d''inflation en pourcentage';
COMMENT ON COLUMN public.economic_countries.unemployment_rate IS 'Taux de chômage en pourcentage';
COMMENT ON COLUMN public.economic_countries.gdp_per_capita IS 'PIB par habitant en dollars USD';
COMMENT ON COLUMN public.economic_countries.main_sectors IS 'Secteurs économiques principaux (array de texte)';

COMMENT ON COLUMN public.regional_economic_metrics.icon_name IS 'Nom de l''icône Lucide React à utiliser (ex: TrendingUp, DollarSign)';
COMMENT ON COLUMN public.regional_economic_metrics.metric_value IS 'Valeur de la métrique (ex: +5.2, 180B, 86M)';
COMMENT ON COLUMN public.regional_economic_metrics.metric_unit IS 'Unité de mesure (ex: %, USD, habitants)';
