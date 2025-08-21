-- Forcer l'insertion des catégories (supprimer les existantes d'abord si nécessaire)
DELETE FROM public.content_categories WHERE slug IN ('economie', 'marches-financiers', 'politique-monetaire', 'industrie-miniere', 'agriculture', 'technologie', 'investissement');

-- Insérer les catégories de contenu par défaut
INSERT INTO public.content_categories (name, slug, description, color, content_types, sort_order) VALUES
('Économie', 'economie', 'Articles et contenus sur l''économie malienne et ouest-africaine', '#10B981', ARRAY['article', 'podcast', 'indice'], 1),
('Marchés Financiers', 'marches-financiers', 'Analyses des marchés financiers et boursiers', '#3B82F6', ARRAY['article', 'podcast', 'indice'], 2),
('Politique Monétaire', 'politique-monetaire', 'Politiques monétaires de la BCEAO et des banques centrales', '#8B5CF6', ARRAY['article', 'podcast'], 3),
('Industrie Minière', 'industrie-miniere', 'Secteur minier et ressources naturelles', '#F59E0B', ARRAY['article', 'podcast'], 4),
('Agriculture', 'agriculture', 'Secteur agricole et agro-industrie', '#059669', ARRAY['article', 'podcast'], 5),
('Technologie', 'technologie', 'Fintech et innovations technologiques', '#6366F1', ARRAY['article', 'podcast'], 6),
('Investissement', 'investissement', 'Opportunités d''investissement et conseils financiers', '#DC2626', ARRAY['article', 'podcast'], 7);

-- Vérifier que les catégories ont été insérées
SELECT COUNT(*) as total_inserted FROM public.content_categories;
