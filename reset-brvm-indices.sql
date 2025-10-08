-- ⚠️  SCRIPT DE NETTOYAGE COMPLET DES INDICES BRVM
-- Ce script supprime TOUTES les données des indices BRVM
-- ATTENTION: Cette action est IRRÉVERSIBLE !

-- 🔥 SUPPRESSION DE TOUTES LES DONNÉES INDICES BRVM

-- 1. Supprimer tous les points de données (brvm_index_points)
DELETE FROM public.brvm_index_points;

-- 2. Supprimer tous les indices (brvm_indices)  
DELETE FROM public.brvm_indices;

-- 3. Supprimer tous les groupes d'indices (brvm_index_groups)
DELETE FROM public.brvm_index_groups;

-- 4. Réinitialiser les séquences si nécessaire (optionnel)
-- Les UUIDs n'ont pas de séquences, donc pas nécessaire ici

-- ✅ VÉRIFICATION DU NETTOYAGE
-- Exécutez ces requêtes pour vérifier que tout est supprimé :

SELECT 'brvm_index_points' as table_name, COUNT(*) as remaining_rows FROM public.brvm_index_points
UNION ALL
SELECT 'brvm_indices' as table_name, COUNT(*) as remaining_rows FROM public.brvm_indices  
UNION ALL
SELECT 'brvm_index_groups' as table_name, COUNT(*) as remaining_rows FROM public.brvm_index_groups;

-- 📋 RÉSULTAT ATTENDU :
-- Toutes les tables doivent afficher 0 lignes

-- 🚀 APRÈS LE NETTOYAGE :
-- 1. Vous pouvez maintenant créer de nouveaux indices via le dashboard
-- 2. Ou utiliser le script test-indices.sql pour recréer des données de test
-- 3. L'application continuera de fonctionner normalement

-- 💡 NOTE :
-- Les tables elles-mêmes ne sont PAS supprimées, seulement les données
-- La structure reste intacte pour continuer à utiliser l'application
