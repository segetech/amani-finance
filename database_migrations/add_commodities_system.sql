-- 🌾 SYSTÈME DE MATIÈRES PREMIÈRES (COMMODITIES)
-- Table pour gérer les matières premières et leurs prix

CREATE TABLE public.commodities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  name text NOT NULL,                    -- Ex: "Café Arabica", "Or", "Pétrole Brent"
  symbol text NOT NULL UNIQUE,          -- Ex: "COFFEE", "GOLD", "BRENT"
  category text NOT NULL,               -- Ex: "Agriculture", "Métaux précieux", "Énergie"
  subcategory text,                     -- Ex: "Céréales", "Métaux industriels"
  
  -- Données de prix actuelles
  current_price numeric,               -- Prix actuel
  previous_price numeric,              -- Prix précédent (pour calcul variation)
  change_amount numeric,               -- Variation en unité de prix
  change_percent numeric,              -- Variation en %
  
  -- Informations de marché
  unit text NOT NULL,                  -- Ex: "USD/tonne", "USD/once", "USD/baril"
  currency text DEFAULT 'USD',        -- Devise de cotation
  market text,                         -- Ex: "CBOT", "COMEX", "ICE"
  contract_month text,                 -- Mois d'échéance du contrat
  
  -- Données de trading
  volume numeric,                      -- Volume d'échanges
  open_interest numeric,               -- Positions ouvertes
  daily_high numeric,                  -- Plus haut du jour
  daily_low numeric,                   -- Plus bas du jour
  
  -- Configuration d'affichage
  is_active boolean DEFAULT true,      -- Actif/Inactif
  show_on_homepage boolean DEFAULT true, -- Afficher sur l'accueil
  display_order integer DEFAULT 0,    -- Ordre d'affichage
  
  -- Métadonnées
  description text,                    -- Description de la matière première
  country_origin text,                 -- Pays d'origine principal
  season_info text,                    -- Informations saisonnières
  
  -- Images et médias
  image_url text,                      -- URL de l'image
  icon text,                          -- Icône Lucide React
  
  -- Horodatage
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_commodities_active ON public.commodities(is_active);
CREATE INDEX idx_commodities_homepage ON public.commodities(show_on_homepage);
CREATE INDEX idx_commodities_category ON public.commodities(category);
CREATE INDEX idx_commodities_order ON public.commodities(display_order);
CREATE INDEX idx_commodities_symbol ON public.commodities(symbol);

-- Trigger pour updated_at
CREATE TRIGGER update_commodities_updated_at 
    BEFORE UPDATE ON public.commodities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security)
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les matières premières" ON public.commodities
    FOR SELECT USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les matières premières" ON public.commodities
    FOR ALL USING (auth.role() = 'authenticated');

-- 🌾 DONNÉES DE TEST - Matières premières populaires
INSERT INTO public.commodities (
    name, symbol, category, subcategory, current_price, previous_price, 
    unit, currency, market, description, country_origin, icon, show_on_homepage
) VALUES
-- Agriculture
('Café Arabica', 'COFFEE', 'Agriculture', 'Boissons', 1.65, 1.58, 'USD/livre', 'USD', 'ICE', 'Café Arabica de qualité supérieure', 'Brésil', 'Coffee', true),
('Cacao', 'COCOA', 'Agriculture', 'Boissons', 2850.00, 2780.00, 'USD/tonne', 'USD', 'ICE', 'Fèves de cacao', 'Côte d''Ivoire', 'Cookie', true),
('Coton', 'COTTON', 'Agriculture', 'Fibres', 0.72, 0.69, 'USD/livre', 'USD', 'ICE', 'Coton brut', 'Mali', 'Shirt', true),
('Riz', 'RICE', 'Agriculture', 'Céréales', 16.50, 16.20, 'USD/cwt', 'USD', 'CBOT', 'Riz blanc', 'Mali', 'Wheat', true),
('Maïs', 'CORN', 'Agriculture', 'Céréales', 6.85, 6.72, 'USD/boisseau', 'USD', 'CBOT', 'Maïs jaune', 'Mali', 'Wheat', true),

-- Métaux précieux
('Or', 'GOLD', 'Métaux précieux', 'Précieux', 1985.50, 1978.20, 'USD/once', 'USD', 'COMEX', 'Or fin 99.9%', 'Mali', 'Coins', true),
('Argent', 'SILVER', 'Métaux précieux', 'Précieux', 24.85, 24.12, 'USD/once', 'USD', 'COMEX', 'Argent fin', 'Mexique', 'Circle', true),

-- Énergie
('Pétrole Brent', 'BRENT', 'Énergie', 'Pétrole', 82.45, 81.20, 'USD/baril', 'USD', 'ICE', 'Pétrole brut Brent', 'Mer du Nord', 'Fuel', true),
('Gaz naturel', 'NATGAS', 'Énergie', 'Gaz', 2.85, 2.92, 'USD/MMBtu', 'USD', 'NYMEX', 'Gaz naturel Henry Hub', 'États-Unis', 'Flame', false),

-- Métaux industriels
('Cuivre', 'COPPER', 'Métaux industriels', 'Base', 8.25, 8.15, 'USD/livre', 'USD', 'COMEX', 'Cuivre haute qualité', 'Chili', 'Zap', false),
('Aluminium', 'ALUMINUM', 'Métaux industriels', 'Base', 2.15, 2.12, 'USD/livre', 'USD', 'LME', 'Aluminium primaire', 'Chine', 'Box', false);

-- Calculer automatiquement les variations pour les données de test
UPDATE public.commodities SET 
    change_amount = current_price - previous_price,
    change_percent = ROUND(((current_price - previous_price) / previous_price * 100)::numeric, 2)
WHERE previous_price IS NOT NULL AND previous_price != 0;

-- ✅ VÉRIFICATION
SELECT 
    name, 
    symbol, 
    category,
    current_price,
    unit,
    change_percent,
    show_on_homepage,
    is_active
FROM public.commodities 
ORDER BY category, display_order, name;
