-- Création de la table market_data pour gérer les données de marché
-- Cette table stocke les informations sur les actions, prix, volumes, etc.

CREATE TABLE IF NOT EXISTS market_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE, -- Code de l'action (ex: BOAB, ETIT)
    name VARCHAR(255) NOT NULL, -- Nom complet de l'entreprise
    sector VARCHAR(100) NOT NULL, -- Secteur d'activité
    
    -- Prix et variations
    current_price DECIMAL(15,2) NOT NULL, -- Prix actuel
    previous_close DECIMAL(15,2) NOT NULL, -- Clôture précédente
    change_amount DECIMAL(15,2) GENERATED ALWAYS AS (current_price - previous_close) STORED, -- Variation en montant
    change_percent DECIMAL(8,4) GENERATED ALWAYS AS (
        CASE 
            WHEN previous_close > 0 THEN ((current_price - previous_close) / previous_close) * 100
            ELSE 0
        END
    ) STORED, -- Variation en pourcentage
    
    -- Données de trading
    volume BIGINT DEFAULT 0, -- Volume de transactions
    market_cap BIGINT, -- Capitalisation boursière
    
    -- Données sur 52 semaines
    high_52w DECIMAL(15,2), -- Plus haut sur 52 semaines
    low_52w DECIMAL(15,2), -- Plus bas sur 52 semaines
    
    -- Ratios financiers
    pe_ratio DECIMAL(8,2), -- Price-to-Earnings ratio
    dividend_yield DECIMAL(5,2), -- Rendement du dividende en %
    
    -- Métadonnées
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Dernière mise à jour des prix
    is_active BOOLEAN DEFAULT TRUE, -- Actif/Inactif
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_sector ON market_data(sector);
CREATE INDEX IF NOT EXISTS idx_market_data_active ON market_data(is_active);
CREATE INDEX IF NOT EXISTS idx_market_data_last_updated ON market_data(last_updated);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_market_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_market_data_updated_at
    BEFORE UPDATE ON market_data
    FOR EACH ROW
    EXECUTE FUNCTION update_market_data_updated_at();

-- Contraintes de validation
ALTER TABLE market_data 
ADD CONSTRAINT check_positive_prices 
CHECK (current_price > 0 AND previous_close > 0);

ALTER TABLE market_data 
ADD CONSTRAINT check_valid_pe_ratio 
CHECK (pe_ratio IS NULL OR pe_ratio > 0);

ALTER TABLE market_data 
ADD CONSTRAINT check_valid_dividend_yield 
CHECK (dividend_yield IS NULL OR (dividend_yield >= 0 AND dividend_yield <= 100));

-- Commentaires pour la documentation
COMMENT ON TABLE market_data IS 'Table des données de marché pour les actions et titres financiers';
COMMENT ON COLUMN market_data.symbol IS 'Code unique de l''action (ex: BOAB, ETIT, ORCI)';
COMMENT ON COLUMN market_data.name IS 'Nom complet de l''entreprise';
COMMENT ON COLUMN market_data.sector IS 'Secteur d''activité (Banque, Télécommunications, etc.)';
COMMENT ON COLUMN market_data.current_price IS 'Prix actuel de l''action en FCFA';
COMMENT ON COLUMN market_data.previous_close IS 'Prix de clôture de la session précédente';
COMMENT ON COLUMN market_data.change_amount IS 'Variation en montant (calculée automatiquement)';
COMMENT ON COLUMN market_data.change_percent IS 'Variation en pourcentage (calculée automatiquement)';
COMMENT ON COLUMN market_data.volume IS 'Volume de transactions';
COMMENT ON COLUMN market_data.market_cap IS 'Capitalisation boursière en FCFA';
COMMENT ON COLUMN market_data.pe_ratio IS 'Ratio cours/bénéfice';
COMMENT ON COLUMN market_data.dividend_yield IS 'Rendement du dividende en pourcentage';

-- Insertion de données de démonstration
INSERT INTO market_data (symbol, name, sector, current_price, previous_close, volume, market_cap, high_52w, low_52w, pe_ratio, dividend_yield) VALUES
('BOAB', 'Bank of Africa Bénin', 'Banque', 4250.00, 4100.00, 15600, 425000000, 4500.00, 3800.00, 12.5, 4.2),
('ETIT', 'Ecobank Transnational', 'Banque', 7800.00, 7950.00, 23400, 780000000, 8200.00, 7200.00, 15.2, 3.8),
('ORCI', 'Orange Côte d''Ivoire', 'Télécommunications', 12500.00, 12200.00, 8900, 1250000000, 13000.00, 11500.00, 18.7, 5.1),
('SNTS', 'SONATEL', 'Télécommunications', 15200.00, 14950.00, 6700, 1520000000, 16000.00, 14000.00, 16.8, 4.8),
('SGCI', 'Société Générale Côte d''Ivoire', 'Banque', 8500.00, 8300.00, 12300, 850000000, 9000.00, 7800.00, 13.9, 3.5),
('TTLC', 'Total Côte d''Ivoire', 'Énergie', 2100.00, 2050.00, 18900, 210000000, 2300.00, 1900.00, 11.2, 6.2)
ON CONFLICT (symbol) DO NOTHING;

-- Permissions (à adapter selon votre système d'authentification)
-- Ces permissions devront être configurées dans votre système Supabase RLS

-- Vue pour les données publiques (sans informations sensibles)
CREATE OR REPLACE VIEW public_market_data AS
SELECT 
    symbol,
    name,
    sector,
    current_price,
    previous_close,
    change_amount,
    change_percent,
    volume,
    market_cap,
    last_updated
FROM market_data 
WHERE is_active = TRUE
ORDER BY symbol;

COMMENT ON VIEW public_market_data IS 'Vue publique des données de marché pour affichage sur le site';
