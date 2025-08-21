-- EXPLICATION: Où sont stockées les catégories dans votre base de données

-- 1. TABLE content_categories: Définit les catégories disponibles
-- Colonnes importantes: id, name, slug, color, content_types
SELECT 'Catégories disponibles:' as info;
SELECT id, name, slug, color FROM public.content_categories ORDER BY sort_order;

-- 2. TABLE contents: Stocke vos podcasts/articles avec référence à la catégorie
-- Colonnes importantes: id, title, category_id (référence vers content_categories.id)
SELECT 'Podcasts et leurs catégories:' as info;
SELECT 
  c.id,
  c.title,
  c.category_id,
  cat.name as category_name,
  cat.slug as category_slug
FROM public.contents c
LEFT JOIN public.content_categories cat ON c.category_id = cat.id
WHERE c.type = 'podcast';

-- 3. PROBLÈME POTENTIEL: Vérifier s'il y a des category_id orphelins
SELECT 'Contenus avec category_id invalide:' as info;
SELECT 
  c.id,
  c.title,
  c.category_id
FROM public.contents c
LEFT JOIN public.content_categories cat ON c.category_id = cat.id
WHERE c.category_id IS NOT NULL AND cat.id IS NULL;
