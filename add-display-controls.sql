-- Script pour ajouter les contrôles d'affichage des sections
-- Exécuter dans Supabase SQL Editor

-- Ajouter une table pour contrôler l'affichage des sections
CREATE TABLE IF NOT EXISTS public.page_section_controls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name VARCHAR(50) NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_name, section_name)
);

-- Insérer les contrôles pour la page économie
INSERT INTO public.page_section_controls (page_name, section_name, is_visible, display_order) VALUES
('economie', 'hero_metrics', true, 1),
('economie', 'economic_dashboard', true, 2),
('economie', 'recent_articles', true, 3)
ON CONFLICT (page_name, section_name) DO NOTHING;

-- Activer RLS
ALTER TABLE public.page_section_controls ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Lecture publique des contrôles de sections" 
  ON public.page_section_controls FOR SELECT 
  USING (true);

-- Politique de modification pour utilisateurs authentifiés
CREATE POLICY "Modification par utilisateurs authentifiés des contrôles" 
  ON public.page_section_controls FOR ALL 
  USING (true);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_page_section_controls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_page_section_controls_updated_at
  BEFORE UPDATE ON public.page_section_controls
  FOR EACH ROW
  EXECUTE FUNCTION update_page_section_controls_updated_at();
