-- Étape 1: Insérer d'abord les nouvelles catégories sans supprimer les anciennes
INSERT INTO public.content_categories (name, slug, description, color, content_types, sort_order) 
SELECT * FROM (VALUES
  ('Économie', 'economie', 'Articles et contenus sur l''économie malienne et ouest-africaine', '#10B981', ARRAY['article', 'podcast', 'indice'], 1),
  ('Marchés Financiers', 'marches-financiers', 'Analyses des marchés financiers et boursiers', '#3B82F6', ARRAY['article', 'podcast', 'indice'], 2),
  ('Politique Monétaire', 'politique-monetaire', 'Politiques monétaires de la BCEAO et des banques centrales', '#8B5CF6', ARRAY['article', 'podcast'], 3),
  ('Industrie Minière', 'industrie-miniere', 'Secteur minier et ressources naturelles', '#F59E0B', ARRAY['article', 'podcast'], 4),
  ('Agriculture', 'agriculture', 'Secteur agricole et agro-industrie', '#059669', ARRAY['article', 'podcast'], 5),
  ('Technologie', 'technologie', 'Fintech et innovations technologiques', '#6366F1', ARRAY['article', 'podcast'], 6),
  ('Investissement', 'investissement', 'Opportunités d''investissement et conseils financiers', '#DC2626', ARRAY['article', 'podcast'], 7)
) AS new_categories(name, slug, description, color, content_types, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_categories 
  WHERE content_categories.slug = new_categories.slug
);

-- Étape 2: Mettre à jour le podcast existant pour utiliser la catégorie "economie"
UPDATE public.contents 
SET category_id = (SELECT id FROM public.content_categories WHERE slug = 'economie' LIMIT 1)
WHERE id = '87af13aa-1293-48fb-91b1-3c16d3894b35';

-- Étape 3: Vérifier le résultat
SELECT 
  c.id, 
  c.title, 
  c.category_id,
  cat.name as category_name,
  cat.slug as category_slug
FROM public.contents c
LEFT JOIN public.content_categories cat ON c.category_id = cat.id
WHERE c.type = 'podcast';
