-- 🎯 NETTOYAGE SÉLECTIF DES INDICES BRVM
-- Choisissez les sections à exécuter selon vos besoins

-- ═══════════════════════════════════════════════════════════════
-- OPTION 1: Supprimer seulement les POINTS DE DONNÉES (garder la structure)
-- ═══════════════════════════════════════════════════════════════

-- Supprimer tous les points de données mais garder les indices
-- DELETE FROM public.brvm_index_points;

-- Ou supprimer les points d'un indice spécifique :
-- DELETE FROM public.brvm_index_points 
-- WHERE indice_id = (SELECT id FROM public.brvm_indices WHERE slug = 'brvm-composite');

-- ═══════════════════════════════════════════════════════════════
-- OPTION 2: Supprimer un INDICE SPÉCIFIQUE et ses données
-- ═══════════════════════════════════════════════════════════════

-- Exemple: Supprimer l'indice "BRVM Composite" et tous ses points
-- DELETE FROM public.brvm_index_points 
-- WHERE indice_id = (SELECT id FROM public.brvm_indices WHERE slug = 'brvm-composite');
-- 
-- DELETE FROM public.brvm_indices WHERE slug = 'brvm-composite';

-- ═══════════════════════════════════════════════════════════════
-- OPTION 3: Supprimer un GROUPE et tous ses indices
-- ═══════════════════════════════════════════════════════════════

-- Exemple: Supprimer le groupe "Indices Principaux" et tout son contenu
-- DELETE FROM public.brvm_index_points 
-- WHERE indice_id IN (
--     SELECT i.id FROM public.brvm_indices i 
--     JOIN public.brvm_index_groups g ON i.group_id = g.id 
--     WHERE g.slug = 'indices-principaux'
-- );
-- 
-- DELETE FROM public.brvm_indices 
-- WHERE group_id = (SELECT id FROM public.brvm_index_groups WHERE slug = 'indices-principaux');
-- 
-- DELETE FROM public.brvm_index_groups WHERE slug = 'indices-principaux';

-- ═══════════════════════════════════════════════════════════════
-- OPTION 4: Supprimer les données ANCIENNES (par date)
-- ═══════════════════════════════════════════════════════════════

-- Supprimer les points de données plus anciens que 30 jours
-- DELETE FROM public.brvm_index_points 
-- WHERE created_at < NOW() - INTERVAL '30 days';

-- Supprimer les points de données avant une date spécifique
-- DELETE FROM public.brvm_index_points 
-- WHERE created_at < '2024-01-01'::timestamp;

-- ═══════════════════════════════════════════════════════════════
-- VÉRIFICATIONS UTILES
-- ═══════════════════════════════════════════════════════════════

-- Voir tous les groupes existants
SELECT g.name, g.slug, COUNT(i.id) as nb_indices
FROM public.brvm_index_groups g
LEFT JOIN public.brvm_indices i ON g.id = i.group_id
GROUP BY g.id, g.name, g.slug
ORDER BY g.name;

-- Voir tous les indices avec leur nombre de points
SELECT i.name, i.code, i.slug, COUNT(p.id) as nb_points
FROM public.brvm_indices i
LEFT JOIN public.brvm_index_points p ON i.id = p.indice_id
GROUP BY i.id, i.name, i.code, i.slug
ORDER BY i.name;

-- Voir les derniers points ajoutés
SELECT i.name, i.code, p.close, p.change_percent, p.created_at
FROM public.brvm_index_points p
JOIN public.brvm_indices i ON p.indice_id = i.id
ORDER BY p.created_at DESC
LIMIT 10;
