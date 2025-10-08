-- 💱 CRÉATION DE LA TABLE CURRENCIES POUR LA GESTION DES DEVISES
-- Table pour gérer les taux de change et devises dans le dashboard

CREATE TABLE IF NOT EXISTS public.currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  code text NOT NULL UNIQUE,              -- Code ISO (EUR, USD, GBP, etc.)
  name text NOT NULL,                     -- Nom complet (Euro, Dollar Américain, etc.)
  symbol text,                            -- Symbole (€, $, £, etc.)
  flag_emoji text,                        -- Emoji du drapeau (🇪🇺, 🇺🇸, etc.)
  
  -- Données de taux de change (contre FCFA)
  current_rate numeric NOT NULL,          -- Taux actuel contre FCFA
  previous_rate numeric,                  -- Taux précédent pour calcul variation
  change_amount numeric GENERATED ALWAYS AS (current_rate - COALESCE(previous_rate, current_rate)) STORED,
  change_percent numeric GENERATED ALWAYS AS (
    CASE 
      WHEN previous_rate IS NOT NULL AND previous_rate > 0 
      THEN ((current_rate - previous_rate) / previous_rate) * 100
      ELSE 0
    END
  ) STORED,
  
  -- Données de trading
  daily_high numeric,                     -- Plus haut du jour
  daily_low numeric,                      -- Plus bas du jour
  volume text,                            -- Volume (ex: "2.4M", "890K")
  
  -- Configuration d'affichage
  is_active boolean DEFAULT true,         -- Actif/Inactif
  is_major boolean DEFAULT false,         -- Devise majeure (affichée en priorité)
  display_order integer DEFAULT 0,       -- Ordre d'affichage
  
  -- Métadonnées
  description text,                       -- Description optionnelle
  country text,                          -- Pays principal
  
  -- Horodatage
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_currencies_code ON public.currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON public.currencies(is_active);
CREATE INDEX IF NOT EXISTS idx_currencies_major ON public.currencies(is_major);
CREATE INDEX IF NOT EXISTS idx_currencies_order ON public.currencies(display_order);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_currencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_currencies_updated_at 
    BEFORE UPDATE ON public.currencies 
    FOR EACH ROW EXECUTE FUNCTION update_currencies_updated_at();

-- Politique RLS (Row Level Security)
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les devises" ON public.currencies
    FOR SELECT USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les devises" ON public.currencies
    FOR ALL USING (auth.role() = 'authenticated');

-- 💰 INSERTION DES DEVISES MAJEURES
INSERT INTO public.currencies (
    code, 
    name, 
    symbol, 
    flag_emoji, 
    current_rate, 
    previous_rate, 
    daily_high, 
    daily_low, 
    volume, 
    is_major, 
    country, 
    description, 
    display_order
) VALUES
-- Devises majeures contre FCFA
('EUR', 'Euro', '€', '🇪🇺', 655.957, 652.340, 658.120, 651.890, '2.4M', true, 'Zone Euro', 'Monnaie unique européenne', 1),
('USD', 'Dollar Américain', '$', '🇺🇸', 602.450, 605.120, 607.230, 600.180, '3.1M', true, 'États-Unis', 'Dollar des États-Unis d''Amérique', 2),
('GBP', 'Livre Sterling', '£', '🇬🇧', 785.320, 782.150, 788.450, 780.920, '1.8M', true, 'Royaume-Uni', 'Livre britannique', 3),
('CHF', 'Franc Suisse', 'CHF', '🇨🇭', 678.890, 681.230, 683.120, 676.450, '890K', true, 'Suisse', 'Franc de la Confédération suisse', 4),
('JPY', 'Yen Japonais', '¥', '🇯🇵', 4.125, 4.098, 4.145, 4.089, '1.2M', true, 'Japon', 'Monnaie du Japon', 5),
('CAD', 'Dollar Canadien', 'C$', '🇨🇦', 445.670, 447.230, 449.120, 443.890, '750K', true, 'Canada', 'Dollar du Canada', 6),
('AUD', 'Dollar Australien', 'A$', '🇦🇺', 402.340, 399.870, 404.560, 398.120, '680K', true, 'Australie', 'Dollar de l''Australie', 7),
('CNY', 'Yuan Chinois', '¥', '🇨🇳', 84.560, 85.120, 85.890, 84.230, '920K', true, 'Chine', 'Renminbi chinois', 8),

-- Devises africaines importantes
('ZAR', 'Rand Sud-Africain', 'R', '🇿🇦', 33.450, 33.120, 33.890, 33.020, '450K', false, 'Afrique du Sud', 'Rand de l''Afrique du Sud', 9),
('EGP', 'Livre Égyptienne', '£', '🇪🇬', 12.340, 12.280, 12.450, 12.200, '320K', false, 'Égypte', 'Livre égyptienne', 10),
('MAD', 'Dirham Marocain', 'DH', '🇲🇦', 60.120, 59.890, 60.340, 59.780, '280K', false, 'Maroc', 'Dirham du Maroc', 11),
('TND', 'Dinar Tunisien', 'DT', '🇹🇳', 190.560, 189.780, 191.230, 189.450, '180K', false, 'Tunisie', 'Dinar de la Tunisie', 12),

-- Autres devises importantes
('SEK', 'Couronne Suédoise', 'kr', '🇸🇪', 57.890, 58.120, 58.450, 57.650, '340K', false, 'Suède', 'Couronne de la Suède', 13),
('NOK', 'Couronne Norvégienne', 'kr', '🇳🇴', 56.780, 56.450, 57.120, 56.340, '290K', false, 'Norvège', 'Couronne de la Norvège', 14),
('DKK', 'Couronne Danoise', 'kr', '🇩🇰', 88.120, 87.890, 88.450, 87.780, '220K', false, 'Danemark', 'Couronne du Danemark', 15)

ON CONFLICT (code) DO UPDATE SET
    current_rate = EXCLUDED.current_rate,
    previous_rate = EXCLUDED.previous_rate,
    daily_high = EXCLUDED.daily_high,
    daily_low = EXCLUDED.daily_low,
    volume = EXCLUDED.volume,
    updated_at = now();

-- 📊 VÉRIFICATION DES DONNÉES INSÉRÉES
SELECT 
    code,
    name,
    flag_emoji,
    current_rate,
    change_percent,
    is_major,
    is_active,
    display_order
FROM public.currencies 
ORDER BY display_order;

-- 🎯 COMMENTAIRES POUR LA DOCUMENTATION
COMMENT ON TABLE public.currencies IS 'Table des devises et taux de change pour le système Forex';
COMMENT ON COLUMN public.currencies.code IS 'Code ISO de la devise (EUR, USD, etc.)';
COMMENT ON COLUMN public.currencies.current_rate IS 'Taux de change actuel contre le Franc CFA (XOF)';
COMMENT ON COLUMN public.currencies.change_amount IS 'Variation en points (calculée automatiquement)';
COMMENT ON COLUMN public.currencies.change_percent IS 'Variation en pourcentage (calculée automatiquement)';
COMMENT ON COLUMN public.currencies.is_major IS 'Devise majeure affichée en priorité sur la page Marché';
COMMENT ON COLUMN public.currencies.volume IS 'Volume de trading (format texte: 2.4M, 890K, etc.)';
