-- 🚀 NOUVEAU SYSTÈME D'INDICES BOURSIERS SIMPLIFIÉ
-- Une seule table pour tout gérer facilement !

CREATE TABLE public.stock_indices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  name text NOT NULL,                    -- Ex: "BRVM Composite", "CAC 40", "Dow Jones"
  symbol text NOT NULL UNIQUE,          -- Ex: "BRVM-C", "CAC40", "DJI"
  market text NOT NULL,                 -- Ex: "BRVM", "Euronext", "NYSE"
  country text DEFAULT 'Mali',          -- Pays de la bourse
  
  -- Données actuelles
  current_value numeric,                -- Valeur actuelle
  previous_value numeric,               -- Valeur précédente (pour calcul variation)
  change_amount numeric,                -- Variation en points
  change_percent numeric,               -- Variation en %
  
  -- Configuration d'affichage
  is_active boolean DEFAULT true,       -- Actif/Inactif
  show_on_homepage boolean DEFAULT true, -- Afficher sur l'accueil (TOGGLE !)
  display_order integer DEFAULT 0,     -- Ordre d'affichage
  
  -- Métadonnées
  unit text DEFAULT 'points',           -- "points", "percent", "currency"
  currency text DEFAULT 'XOF',         -- Devise si applicable
  description text,                     -- Description optionnelle
  
  -- Horodatage
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_stock_indices_active ON public.stock_indices(is_active);
CREATE INDEX idx_stock_indices_homepage ON public.stock_indices(show_on_homepage);
CREATE INDEX idx_stock_indices_order ON public.stock_indices(display_order);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_stock_indices_updated_at 
    BEFORE UPDATE ON public.stock_indices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) - Tous les utilisateurs authentifiés peuvent voir
ALTER TABLE public.stock_indices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les indices" ON public.stock_indices
    FOR SELECT USING (true);

CREATE POLICY "Seuls les admins peuvent modifier" ON public.stock_indices
    FOR ALL USING (auth.role() = 'authenticated');

-- 🎯 DONNÉES DE TEST - Quelques indices populaires
INSERT INTO public.stock_indices (name, symbol, market, country, current_value, previous_value, unit, description, show_on_homepage) VALUES
('BRVM Composite', 'BRVM-C', 'BRVM', 'Mali', 185.42, 181.25, 'points', 'Indice composite de la Bourse Régionale des Valeurs Mobilières', true),
('BRVM 10', 'BRVM-10', 'BRVM', 'Mali', 165.78, 163.12, 'points', 'Indice des 10 principales capitalisations BRVM', true),
('CAC 40', 'CAC40', 'Euronext Paris', 'France', 7245.50, 7198.30, 'points', 'Indice phare de la Bourse de Paris', false),
('Dow Jones', 'DJI', 'NYSE', 'États-Unis', 33875.40, 33721.15, 'points', 'Indice industriel Dow Jones', false);

-- Calculer automatiquement les variations pour les données de test
UPDATE public.stock_indices SET 
    change_amount = current_value - previous_value,
    change_percent = ROUND(((current_value - previous_value) / previous_value * 100)::numeric, 2)
WHERE previous_value IS NOT NULL AND previous_value != 0;

-- ✅ VÉRIFICATION
SELECT 
    name, 
    symbol, 
    market,
    current_value,
    change_percent,
    show_on_homepage,
    is_active
FROM public.stock_indices 
ORDER BY display_order, name;
