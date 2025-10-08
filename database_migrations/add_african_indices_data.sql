-- 🌍 AJOUT DES INDICES BOURSIERS AFRICAINS
-- Basé sur l'image SikaFinance - Indices des places africaines

-- Ajouter des colonnes pour les variations sur différentes périodes si elles n'existent pas
ALTER TABLE public.stock_indices 
ADD COLUMN IF NOT EXISTS change_1_day numeric,    -- Variation 1 jour
ADD COLUMN IF NOT EXISTS change_1_year numeric,   -- Variation 1 an  
ADD COLUMN IF NOT EXISTS change_5_years numeric,  -- Variation 5 ans
ADD COLUMN IF NOT EXISTS country_flag text,       -- Code du drapeau (emoji ou code pays)
ADD COLUMN IF NOT EXISTS last_trade_date date;    -- Date de dernière transaction

-- 🧹 NETTOYAGE PRÉVENTIF - Supprimer les indices africains existants pour éviter les doublons
DELETE FROM public.stock_indices 
WHERE symbol IN (
    'BRVM-COMP', 'GSE-CI', 'NGX-ASI', 'NGX-ALL', 'TUNINDEX', 'BRVM-30-AFR', 
    'SGBV-INDEX', 'MASI', 'BSE-DCI', 'DSEI', 'EGX30', 'JSE-ALSI', 
    'LuSE', 'MSE-ASI', 'RSE-ASI', 'SEMDEX', 'USE-ALSI', 'ZSE-INDX'
);

-- 📊 INSERTION DES INDICES AFRICAINS
-- Données basées sur l'image SikaFinance

INSERT INTO public.stock_indices (
    name, 
    symbol, 
    market, 
    country, 
    country_flag,
    current_value, 
    previous_value, 
    change_percent,
    change_1_day,
    change_1_year, 
    change_5_years,
    last_trade_date,
    unit, 
    description, 
    show_on_homepage,
    display_order
) VALUES

-- 🇨🇮 CÔTE D'IVOIRE - BRVM
('BRVM COMPOSITE', 'BRVM-COMP', 'BRVM', 'Côte d''Ivoire', '🇨🇮', 
 191.11, 188.89, 0.04, 19.90, 22.70, 64.10, '2024-10-08', 
 'points', 'Indice composite de la Bourse Régionale des Valeurs Mobilières', true, 1),

-- 🇬🇭 GHANA
('GHANA COMPOSITE INDEX', 'GSE-CI', 'Ghana Stock Exchange', 'Ghana', '🇬🇭', 
 3443.88, 3427.65, 0.26, 72.73, 93.93, 243.93, '2024-10-08', 
 'points', 'Indice composite de la Bourse du Ghana', true, 2),

-- 🇳🇬 NIGERIA  
('NAIROJI ALL SHARE INDEX', 'NGX-ASI', 'Nigerian Exchange', 'Nigeria', '🇳🇬', 
 176.28, 171.45, 2.78, 62.76, 62.63, 36.51, '2024-10-08', 
 'points', 'Indice All Share de la Bourse du Nigeria', true, 3),

('NIGERIA ALL SHARE INDEX', 'NGX-ALL', 'Nigerian Exchange', 'Nigeria', '🇳🇬', 
 144995.26, 142156.78, 0.12, 40.57, 48.28, 206.21, '2024-10-08', 
 'points', 'Indice All Share Nigeria', true, 4),

-- 🇹🇳 TUNISIE
('TUNINDEX', 'TUNINDEX', 'Bourse de Tunis', 'Tunisie', '🇹🇳', 
 12298.81, 12187.45, 0.19, 23.50, 24.20, 51.84, '2024-10-08', 
 'points', 'Indice principal de la Bourse de Tunis', true, 5),

-- 🇧🇯 BÉNIN - BRVM
('BRVM 30', 'BRVM-30-AFR', 'BRVM', 'Bénin', '🇧🇯', 
 161.94, 160.12, 0.62, 16.19, 22.39, 6.60, '2024-10-08', 
 'points', 'Indice BRVM 30 principales capitalisations', true, 6),

-- 🇩🇿 ALGÉRIE
('INDICE ALGER', 'SGBV-INDEX', 'Bourse d''Alger', 'Algérie', '🇩🇿', 
 3556.13, 3475.89, 2.31, 9.81, 2.11, 35.82, '2024-10-08', 
 'points', 'Indice composite de la Bourse d''Alger', true, 7),

-- 🇲🇦 MAROC
('MASI', 'MASI', 'Bourse de Casablanca', 'Maroc', '🇲🇦', 
 14961.55, 14723.42, 0.51, 24.50, 26.41, 41.72, '2024-10-08', 
 'points', 'Moroccan All Shares Index', true, 8),

-- 🇧🇼 BOTSWANA
('BSE BOTSWANA', 'BSE-DCI', 'Botswana Stock Exchange', 'Botswana', '🇧🇼', 
 16512.48, 16398.76, 0.09, 5.61, 9.82, 42.81, '2024-10-08', 
 'points', 'Indice composite du Botswana', true, 9),

-- 🇹🇿 TANZANIE
('DSE TANZANIA', 'DSEI', 'Dar es Salaam Stock Exchange', 'Tanzanie', '🇹🇿', 
 2499.25, 2436.78, 0.56, 16.79, 14.54, 35.22, '2024-10-08', 
 'points', 'Indice de la Bourse de Dar es Salaam', true, 10),

-- 🇪🇬 ÉGYPTE
('EGX 30 EGYPT', 'EGX30', 'Egyptian Exchange', 'Égypte', '🇪🇬', 
 27697.27, 27521.45, 0.61, 24.79, 20.24, 272.19, '2024-10-08', 
 'points', 'Indice EGX 30 de la Bourse égyptienne', true, 11),

-- 🇿🇦 AFRIQUE DU SUD
('JSE JOHANNESBURG', 'JSE-ALSI', 'Johannesburg Stock Exchange', 'Afrique du Sud', '🇿🇦', 
 109448.90, 108876.23, 0.43, 30.15, 26.62, 65.58, '2024-10-08', 
 'points', 'Indice All Share de Johannesburg', true, 12),

-- 🇿🇲 ZAMBIE
('LUSE ZAMBIA', 'LuSE', 'Lusaka Stock Exchange', 'Zambie', '🇿🇲', 
 25390.82, 25167.45, 0.89, 44.43, 59.67, 251.42, '2024-10-08', 
 'points', 'Indice de la Bourse de Lusaka', true, 13),

-- 🇲🇼 MALAWI
('MSE MALAWI', 'MSE-ASI', 'Malawi Stock Exchange', 'Malawi', '🇲🇼', 
 804548.76, 801234.56, 0.17, 261.40, 336.39, 1071.34, '2024-10-08', 
 'points', 'Indice All Share du Malawi', true, 14),

-- 🇷🇼 RWANDA
('RSE RWANDA', 'RSE-ASI', 'Rwanda Stock Exchange', 'Rwanda', '🇷🇼', 
 179.30, 177.89, 0.02, 29.40, 22.79, 21.49, '2024-10-08', 
 'points', 'Indice All Share du Rwanda', true, 15),

-- 🇲🇺 MAURICE
('SEM MAURITIUS', 'SEMDEX', 'Stock Exchange of Mauritius', 'Maurice', '🇲🇺', 
 2193.58, 2175.67, 0.83, 2.67, 4.11, 15.21, '2024-10-08', 
 'points', 'Indice SEMDEX de la Bourse de Maurice', true, 16),

-- 🇺🇬 OUGANDA
('USE UGANDA', 'USE-ALSI', 'Uganda Securities Exchange', 'Ouganda', '🇺🇬', 
 1463.04, 1451.23, 0.56, 22.43, 31.01, 15.52, '2024-10-08', 
 'points', 'Indice All Share de l''Ouganda', true, 17),

-- 🇿🇼 ZIMBABWE
('ZSE ZIMBABWE', 'ZSE-INDX', 'Zimbabwe Stock Exchange', 'Zimbabwe', '🇿🇼', 
 707.82, 702.34, 2.75, 4.79, 18.68, 6.00, '2024-10-08', 
 'points', 'Indice industriel du Zimbabwe', true, 18);

-- Calculer automatiquement les variations en montant
UPDATE public.stock_indices SET 
    change_amount = current_value - previous_value
WHERE previous_value IS NOT NULL AND previous_value != 0;

-- Mettre à jour les timestamps
UPDATE public.stock_indices SET 
    last_updated = now(),
    updated_at = now()
WHERE market IN ('BRVM', 'Ghana Stock Exchange', 'Nigerian Exchange', 'Bourse de Tunis', 
                 'Bourse d''Alger', 'Bourse de Casablanca', 'Botswana Stock Exchange',
                 'Dar es Salaam Stock Exchange', 'Egyptian Exchange', 'Johannesburg Stock Exchange',
                 'Lusaka Stock Exchange', 'Malawi Stock Exchange', 'Rwanda Stock Exchange',
                 'Stock Exchange of Mauritius', 'Uganda Securities Exchange', 'Zimbabwe Stock Exchange');

-- 📊 VÉRIFICATION DES DONNÉES INSÉRÉES
SELECT 
    name,
    symbol,
    market,
    country,
    country_flag,
    current_value,
    change_percent,
    change_1_year,
    show_on_homepage,
    display_order
FROM public.stock_indices 
WHERE country != 'Mali' OR market = 'BRVM'
ORDER BY display_order;

-- 🎯 COMMENTAIRES POUR LA DOCUMENTATION
COMMENT ON COLUMN public.stock_indices.change_1_day IS 'Variation sur 1 jour en pourcentage';
COMMENT ON COLUMN public.stock_indices.change_1_year IS 'Variation sur 1 an en pourcentage';
COMMENT ON COLUMN public.stock_indices.change_5_years IS 'Variation sur 5 ans en pourcentage';
COMMENT ON COLUMN public.stock_indices.country_flag IS 'Emoji ou code du drapeau du pays';
COMMENT ON COLUMN public.stock_indices.last_trade_date IS 'Date de la dernière transaction';
