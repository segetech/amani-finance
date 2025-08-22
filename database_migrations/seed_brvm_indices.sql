-- Seed BRVM indices and initial points
-- Idempotent: safe to re-run

BEGIN;

-- Ensure extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Tables (create if not exists)
CREATE TABLE IF NOT EXISTS public.brvm_index_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brvm_indices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.brvm_index_groups(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Points for indices. NOTE: client code expects column name 'indice_id' and timestamp 'created_at'
CREATE TABLE IF NOT EXISTS public.brvm_index_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indice_id UUID NOT NULL REFERENCES public.brvm_indices(id) ON DELETE CASCADE,
  previous_close NUMERIC(12,2),
  close NUMERIC(12,2) NOT NULL,
  change NUMERIC(12,2),
  change_percent NUMERIC(7,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_brvm_indices_group ON public.brvm_indices(group_id);
CREATE INDEX IF NOT EXISTS idx_brvm_points_indice_time ON public.brvm_index_points(indice_id, created_at DESC);

-- Ensure columns exist if table was created previously with a different shape
ALTER TABLE public.brvm_index_points
  ADD COLUMN IF NOT EXISTS change NUMERIC(12,2);
ALTER TABLE public.brvm_index_points
  ADD COLUMN IF NOT EXISTS change_percent NUMERIC(7,2);

-- Coerce types to NUMERIC if an older schema created them as TEXT (handle comma decimals)
DO $$ BEGIN
  -- previous_close -> NUMERIC(12,2)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='brvm_index_points' AND column_name='previous_close' AND data_type IN ('text','character varying')
  ) THEN
    EXECUTE 'ALTER TABLE public.brvm_index_points 
      ALTER COLUMN previous_close TYPE NUMERIC(12,2) 
      USING NULLIF(replace(previous_close::text, '',''', ''.''), '''')::numeric';
  END IF;

  -- close -> NUMERIC(12,2)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='brvm_index_points' AND column_name='close' AND data_type IN ('text','character varying')
  ) THEN
    EXECUTE 'ALTER TABLE public.brvm_index_points 
      ALTER COLUMN close TYPE NUMERIC(12,2) 
      USING NULLIF(replace(close::text, '',''', ''.''), '''')::numeric';
  END IF;

  -- change -> NUMERIC(12,2)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='brvm_index_points' AND column_name='change' AND data_type IN ('text','character varying')
  ) THEN
    EXECUTE 'ALTER TABLE public.brvm_index_points 
      ALTER COLUMN change TYPE NUMERIC(12,2) 
      USING NULLIF(replace(change::text, '',''', ''.''), '''')::numeric';
  END IF;

  -- change_percent -> NUMERIC(7,2)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='brvm_index_points' AND column_name='change_percent' AND data_type IN ('text','character varying')
  ) THEN
    EXECUTE 'ALTER TABLE public.brvm_index_points 
      ALTER COLUMN change_percent TYPE NUMERIC(7,2) 
      USING NULLIF(replace(change_percent::text, '',''', ''.''), '''')::numeric';
  END IF;
END $$;

-- 2) RLS (basic): public read, authenticated write
ALTER TABLE public.brvm_index_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brvm_indices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brvm_index_points ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_index_groups' AND policyname = 'Read groups'
  ) THEN
    CREATE POLICY "Read groups" ON public.brvm_index_groups FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_index_groups' AND policyname = 'Write groups (auth)'
  ) THEN
    CREATE POLICY "Write groups (auth)" ON public.brvm_index_groups FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_indices' AND policyname = 'Read indices'
  ) THEN
    CREATE POLICY "Read indices" ON public.brvm_indices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_indices' AND policyname = 'Write indices (auth)'
  ) THEN
    CREATE POLICY "Write indices (auth)" ON public.brvm_indices FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_index_points' AND policyname = 'Read points'
  ) THEN
    CREATE POLICY "Read points" ON public.brvm_index_points FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'brvm_index_points' AND policyname = 'Write points (auth)'
  ) THEN
    CREATE POLICY "Write points (auth)" ON public.brvm_index_points FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Drop view first to ensure column list is refreshed
DROP VIEW IF EXISTS public.brvm_indices_latest;
CREATE VIEW public.brvm_indices_latest AS
SELECT i.*,
       p_latest.close AS latest_close,
       COALESCE(p_latest.change, (p_latest.close - p_latest.previous_close)) AS latest_change,
       p_latest.change_percent AS latest_change_percent,
       p_latest.created_at AS latest_at
FROM public.brvm_indices i
LEFT JOIN LATERAL (
  SELECT p.* FROM public.brvm_index_points p WHERE p.indice_id = i.id ORDER BY p.created_at DESC LIMIT 1
) p_latest ON TRUE;

-- 4) Seed groups (upsert by slug)
WITH upsert_groups AS (
  INSERT INTO public.brvm_index_groups (name, slug, sort_order)
  VALUES
    ('Indices principaux', 'indices-principaux', 1),
    ('Indices sectoriels nouveaux', 'indices-sectoriels-nouveaux', 2),
    ('Indices sectoriels anciens', 'indices-sectoriels-anciens', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
  RETURNING id, slug
)
SELECT 1;

-- Capture group IDs
WITH g AS (
  SELECT slug, id FROM public.brvm_index_groups WHERE slug IN ('indices-principaux','indices-sectoriels-nouveaux','indices-sectoriels-anciens')
),
-- 5) Seed indices (upsert by code)
upsert_indices AS (
  INSERT INTO public.brvm_indices (group_id, code, name, slug, metadata)
  VALUES
  -- Principaux
  ((SELECT id FROM g WHERE slug='indices-principaux'), 'BRVM-30', 'BRVM-30', 'brvm-30', '{"source":"brvm"}'),
  ((SELECT id FROM g WHERE slug='indices-principaux'), 'BRVM-COMPOSITE', 'BRVM - COMPOSITE', 'brvm-composite', '{"source":"brvm"}'),
  ((SELECT id FROM g WHERE slug='indices-principaux'), 'BRVM-PRESTIGE', 'BRVM - PRESTIGE', 'brvm-prestige', '{"source":"brvm"}'),
  ((SELECT id FROM g WHERE slug='indices-principaux'), 'BRVM-PRINCIPAL', 'BRVM - PRINCIPAL', 'brvm-principal', '{"source":"brvm"}'),
  -- Sectoriels nouveaux
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-CONSOMMATION-DE-BASE', 'BRVM - CONSOMMATION DE BASE', 'brvm-consommation-de-base', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-CONSOMMATION-DISCRETIONNAIRE', 'BRVM - CONSOMMATION DISCRETIONNAIRE', 'brvm-consommation-discretionnaire', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-ENERGIE', 'BRVM - ENERGIE', 'brvm-energie', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-INDUSTRIELS', 'BRVM - INDUSTRIELS', 'brvm-industriels', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-SERVICES-FINANCIERS', 'BRVM - SERVICES FINANCIERS', 'brvm-services-financiers', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-SERVICES-PUBLICS-NOUVEAU', 'BRVM - SERVICES PUBLICS', 'brvm-services-publics-nouveau', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-nouveaux'), 'BRVM-TELECOMMUNICATIONS', 'BRVM - TELECOMMUNICATIONS', 'brvm-telecommunications', '{}'),
  -- Sectoriels anciens
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-AGRICULTURE', 'BRVM - AGRICULTURE', 'brvm-agriculture', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-AUTRES-SECTEURS', 'BRVM - AUTRES SECTEURS', 'brvm-autres-secteurs', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-DISTRIBUTION', 'BRVM - DISTRIBUTION', 'brvm-distribution', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-FINANCE', 'BRVM - FINANCE', 'brvm-finance', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-INDUSTRIE-ANCIEN', 'BRVM - INDUSTRIE', 'brvm-industrie-ancien', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-SERVICES-PUBLICS-ANCIEN', 'BRVM - SERVICES PUBLICS', 'brvm-services-publics-ancien', '{}'),
  ((SELECT id FROM g WHERE slug='indices-sectoriels-anciens'), 'BRVM-TRANSPORT', 'BRVM - TRANSPORT', 'brvm-transport', '{}')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, group_id = EXCLUDED.group_id
  RETURNING id, code
)
SELECT 1;

-- 6) Seed a snapshot of points (based on provided screenshot)
-- Use ON CONFLICT DO NOTHING to avoid duplications if same timestamp inserted repeatedly
DO $$
DECLARE
  now_ts TIMESTAMPTZ := now();
  rec RECORD;
BEGIN
  -- Helper to insert one point
  PERFORM 1; -- no-op
  
  -- Principaux
  INSERT INTO public.brvm_index_points (indice_id, previous_close, close, change, change_percent, created_at)
  SELECT i.id, 154.80, 154.80, 0.00, 0.00, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-30'
  ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 318.59, 319.04, 319.04-318.59, 0.14, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-COMPOSITE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 132.08, 132.12, 132.12-132.08, 0.03, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-PRESTIGE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 192.24, 193.09, 193.09-192.24, 0.44, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-PRINCIPAL' ON CONFLICT DO NOTHING;

  -- Nouveaux sectoriels
  INSERT INTO public.brvm_index_points SELECT i.id, 220.40, 221.93, 221.93-220.40, 0.69, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-CONSOMMATION-DE-BASE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 107.85, 106.95, 106.95-107.85, -0.83, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-CONSOMMATION-DISCRETIONNAIRE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 110.13, 111.26, 111.26-110.13, 1.03, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-ENERGIE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 141.20, 142.49, 142.49-141.20, 0.91, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-INDUSTRIELS' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 122.33, 122.68, 122.68-122.33, 0.29, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-SERVICES-FINANCIERS' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 100.18, 99.70, 99.70-100.18, -0.48, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-SERVICES-PUBLICS-NOUVEAU' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 93.83, 93.61, 93.61-93.83, -0.23, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-TELECOMMUNICATIONS' ON CONFLICT DO NOTHING;

  -- Anciens sectoriels
  INSERT INTO public.brvm_index_points SELECT i.id, 329.31, 331.16, 331.16-329.31, 0.56, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-AGRICULTURE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 630.63, 633.23, 633.23-630.63, 0.41, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-AUTRES-SECTEURS' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 371.16, 372.07, 372.07-371.16, 0.25, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-DISTRIBUTION' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 124.47, 124.88, 124.88-124.47, 0.33, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-FINANCE' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 266.90, 268.78, 268.78-266.90, 0.70, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-INDUSTRIE-ANCIEN' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 718.40, 716.65, 716.65-718.40, -0.24, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-SERVICES-PUBLICS-ANCIEN' ON CONFLICT DO NOTHING;
  INSERT INTO public.brvm_index_points SELECT i.id, 372.06, 375.73, 375.73-372.06, 0.99, now_ts FROM public.brvm_indices i WHERE i.code = 'BRVM-TRANSPORT' ON CONFLICT DO NOTHING;
END $$;

COMMIT;
