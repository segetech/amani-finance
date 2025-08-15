-- Migration pour ajouter les colonnes manquantes à la table profiles
-- Exécuter dans Supabase SQL Editor

-- Ajouter les nouvelles colonnes à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS linkedin VARCHAR(300),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(300),
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- Mettre à jour le type TypeScript si nécessaire
COMMENT ON COLUMN profiles.phone IS 'Numéro de téléphone de l''utilisateur';
COMMENT ON COLUMN profiles.location IS 'Localisation/ville de l''utilisateur';
COMMENT ON COLUMN profiles.linkedin IS 'URL du profil LinkedIn';
COMMENT ON COLUMN profiles.twitter IS 'URL du profil Twitter/X';
COMMENT ON COLUMN profiles.preferences IS 'Préférences utilisateur au format JSON';

-- Optionnel: Ajouter des index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_preferences ON profiles USING GIN(preferences);
