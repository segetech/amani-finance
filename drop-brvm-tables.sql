-- ⚠️  SUPPRESSION COMPLÈTE DES TABLES BRVM
-- ATTENTION: Ceci supprime les tables ET les données définitivement !
-- Vous devrez recréer les tables après si vous voulez utiliser les indices

-- Supprimer les tables dans l'ordre (contraintes de clés étrangères)
DROP TABLE IF EXISTS public.brvm_index_points CASCADE;
DROP TABLE IF EXISTS public.brvm_indices CASCADE;  
DROP TABLE IF EXISTS public.brvm_index_groups CASCADE;

-- Supprimer aussi la vue si elle existe
DROP VIEW IF EXISTS public.brvm_indices_latest CASCADE;

-- Vérification - ces tables ne doivent plus exister
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'brvm_%';
