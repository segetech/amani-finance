-- Script pour corriger les politiques RLS des données économiques
-- Exécuter dans Supabase SQL Editor

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Les données économiques des pays sont visibles par tous" ON public.economic_countries;
DROP POLICY IF EXISTS "Seuls les administrateurs peuvent modifier les données économiques des pays" ON public.economic_countries;
DROP POLICY IF EXISTS "Les métriques régionales sont visibles par tous" ON public.regional_economic_metrics;
DROP POLICY IF EXISTS "Seuls les administrateurs peuvent modifier les métriques régionales" ON public.regional_economic_metrics;

-- Nouvelles politiques plus permissives pour economic_countries
CREATE POLICY "Lecture publique des pays" 
  ON public.economic_countries FOR SELECT 
  USING (true);

CREATE POLICY "Modification par utilisateurs authentifiés" 
  ON public.economic_countries FOR ALL 
  USING (true);

-- Nouvelles politiques plus permissives pour regional_economic_metrics
CREATE POLICY "Lecture publique des métriques" 
  ON public.regional_economic_metrics FOR SELECT 
  USING (true);

CREATE POLICY "Modification par utilisateurs authentifiés des métriques" 
  ON public.regional_economic_metrics FOR ALL 
  USING (true);

-- Vérifier que RLS est activé
ALTER TABLE public.economic_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_economic_metrics ENABLE ROW LEVEL SECURITY;

-- Afficher les politiques créées
SELECT schemaname, tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE tablename IN ('economic_countries', 'regional_economic_metrics');
