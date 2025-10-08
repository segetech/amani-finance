-- 🔥 NETTOYAGE RAPIDE - Supprimer toutes les données des indices BRVM
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer tous les points de données
DELETE FROM public.brvm_index_points;

-- 2. Supprimer tous les indices
DELETE FROM public.brvm_indices;

-- 3. Supprimer tous les groupes
DELETE FROM public.brvm_index_groups;

-- 4. Vérification - ces requêtes doivent retourner 0
SELECT 'Points supprimés' as action, COUNT(*) as remaining FROM public.brvm_index_points
UNION ALL
SELECT 'Indices supprimés' as action, COUNT(*) as remaining FROM public.brvm_indices
UNION ALL  
SELECT 'Groupes supprimés' as action, COUNT(*) as remaining FROM public.brvm_index_groups;
