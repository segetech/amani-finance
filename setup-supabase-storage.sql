-- =====================================================
-- CONFIGURATION SUPABASE STORAGE POUR AMANI FINANCE
-- =====================================================
-- Ce script configure le stockage d'images pour les opportunités d'investissement

-- =====================================================
-- 1. CRÉATION DU BUCKET IMAGES
-- =====================================================

-- Créer le bucket 'images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- 2. POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow public read access on images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Allow public read access on images bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN ('investment-opportunities', 'industrial-companies', 'economic-countries')
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update their images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 3. FONCTION UTILITAIRE POUR NETTOYER LES IMAGES ORPHELINES
-- =====================================================

CREATE OR REPLACE FUNCTION clean_orphaned_images()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer les images d'opportunités d'investissement qui ne sont plus référencées
  DELETE FROM storage.objects 
  WHERE bucket_id = 'images' 
    AND name LIKE 'investment-opportunities/%'
    AND NOT EXISTS (
      SELECT 1 FROM investment_opportunities 
      WHERE image_url LIKE '%' || storage.objects.name || '%'
    );
    
  -- Supprimer les images d'entreprises industrielles qui ne sont plus référencées
  DELETE FROM storage.objects 
  WHERE bucket_id = 'images' 
    AND name LIKE 'industrial-companies/%'
    AND NOT EXISTS (
      SELECT 1 FROM industrial_companies 
      WHERE image_url LIKE '%' || storage.objects.name || '%'
    );
    
  RAISE NOTICE 'Nettoyage des images orphelines terminé';
END;
$$;

-- =====================================================
-- 4. TRIGGER POUR NETTOYER AUTOMATIQUEMENT LES IMAGES
-- =====================================================

-- Fonction trigger pour supprimer l'image quand une opportunité est supprimée
CREATE OR REPLACE FUNCTION delete_opportunity_image()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Si l'ancienne image était sur Supabase Storage, la supprimer
  IF OLD.image_url IS NOT NULL AND OLD.image_url LIKE '%supabase%' THEN
    -- Extraire le chemin du fichier de l'URL
    DECLARE
      file_path TEXT;
    BEGIN
      -- Extraire le chemin après le dernier '/' dans l'URL
      file_path := substring(OLD.image_url from '.*/images/(.*)$');
      
      IF file_path IS NOT NULL THEN
        -- Supprimer le fichier du storage
        PERFORM storage.delete_object('images', file_path);
        RAISE NOTICE 'Image supprimée du storage: %', file_path;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erreur lors de la suppression de l''image: %', SQLERRM;
    END;
  END IF;
  
  RETURN OLD;
END;
$$;

-- Créer le trigger sur la table investment_opportunities
DROP TRIGGER IF EXISTS trigger_delete_opportunity_image ON investment_opportunities;
CREATE TRIGGER trigger_delete_opportunity_image
  BEFORE DELETE ON investment_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION delete_opportunity_image();

-- =====================================================
-- 5. VUES UTILITAIRES
-- =====================================================

-- Vue pour lister toutes les images stockées
CREATE OR REPLACE VIEW storage_images_summary AS
SELECT 
  name as file_path,
  size,
  created_at,
  updated_at,
  CASE 
    WHEN name LIKE 'investment-opportunities/%' THEN 'Investment Opportunities'
    WHEN name LIKE 'industrial-companies/%' THEN 'Industrial Companies'
    WHEN name LIKE 'economic-countries/%' THEN 'Economic Countries'
    ELSE 'Other'
  END as category,
  -- Vérifier si l'image est encore référencée
  CASE 
    WHEN name LIKE 'investment-opportunities/%' THEN 
      EXISTS(SELECT 1 FROM investment_opportunities WHERE image_url LIKE '%' || name || '%')
    WHEN name LIKE 'industrial-companies/%' THEN 
      EXISTS(SELECT 1 FROM industrial_companies WHERE image_url LIKE '%' || name || '%')
    ELSE true
  END as is_referenced
FROM storage.objects 
WHERE bucket_id = 'images'
ORDER BY created_at DESC;

-- =====================================================
-- 6. INFORMATIONS DE CONFIGURATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== CONFIGURATION SUPABASE STORAGE TERMINÉE ===';
  RAISE NOTICE 'Bucket créé: images (public, 10MB max)';
  RAISE NOTICE 'Formats acceptés: JPEG, PNG, WebP, GIF';
  RAISE NOTICE 'Dossiers: investment-opportunities/, industrial-companies/, economic-countries/';
  RAISE NOTICE '';
  RAISE NOTICE 'Politiques RLS configurées:';
  RAISE NOTICE '- Lecture publique autorisée';
  RAISE NOTICE '- Upload/modification/suppression pour utilisateurs authentifiés';
  RAISE NOTICE '';
  RAISE NOTICE 'Fonctions utilitaires:';
  RAISE NOTICE '- clean_orphaned_images() : nettoie les images non référencées';
  RAISE NOTICE '- Trigger automatique de suppression d''images';
  RAISE NOTICE '';
  RAISE NOTICE 'Vue disponible: storage_images_summary';
  RAISE NOTICE '';
  RAISE NOTICE 'URLs d''accès:';
  RAISE NOTICE 'https://[votre-projet].supabase.co/storage/v1/object/public/images/[chemin-fichier]';
END $$;
