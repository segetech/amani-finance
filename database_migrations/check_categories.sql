-- Vérifier si les catégories existent dans la base de données
SELECT COUNT(*) as total_categories FROM public.content_categories;

-- Voir toutes les catégories existantes
SELECT id, name, slug, is_active FROM public.content_categories ORDER BY sort_order;

-- Vérifier les contenus qui ont des category_id
SELECT id, title, category_id FROM public.contents WHERE type = 'podcast' LIMIT 5;
