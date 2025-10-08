-- 🔥 NETTOYAGE COMPLET - Supprimer tout l'ancien système BRVM
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Supprimer toutes les données
DELETE FROM public.brvm_index_points;
DELETE FROM public.brvm_indices;
DELETE FROM public.brvm_index_groups;

-- 2. Supprimer les tables complètement
DROP TABLE IF EXISTS public.brvm_index_points CASCADE;
DROP TABLE IF EXISTS public.brvm_indices CASCADE;
DROP TABLE IF EXISTS public.brvm_index_groups CASCADE;

-- 3. Supprimer les vues si elles existent
DROP VIEW IF EXISTS public.brvm_indices_latest CASCADE;

-- 4. Vérification - aucune table BRVM ne doit rester
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'brvm_%';

-- ✅ Si cette requête ne retourne rien, le nettoyage est terminé !
