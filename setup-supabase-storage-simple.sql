-- =====================================================
-- CONFIGURATION SUPABASE STORAGE SIMPLE - AMANI FINANCE
-- =====================================================
-- Version simplifiée pour éviter les conflits

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
-- 2. POLITIQUES DE SÉCURITÉ (RLS) - VERSION SIMPLE
-- =====================================================

-- Supprimer toutes les anciennes politiques pour le bucket images
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname LIKE '%images%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- Politique simple pour la lecture publique
CREATE POLICY "images_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Politique simple pour l'upload par les utilisateurs authentifiés
CREATE POLICY "images_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Politique simple pour la mise à jour par les utilisateurs authentifiés
CREATE POLICY "images_authenticated_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Politique simple pour la suppression par les utilisateurs authentifiés
CREATE POLICY "images_authenticated_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 3. VÉRIFICATION DE LA CONFIGURATION
-- =====================================================

DO $$
BEGIN
  -- Vérifier que le bucket existe
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
    RAISE NOTICE '✅ Bucket "images" configuré avec succès';
    RAISE NOTICE '   - Public: true';
    RAISE NOTICE '   - Taille max: 10MB';
    RAISE NOTICE '   - Formats: JPEG, PNG, WebP, GIF';
  ELSE
    RAISE NOTICE '❌ Erreur: Bucket "images" non créé';
  END IF;
  
  -- Vérifier les politiques
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'images_public_read') THEN
    RAISE NOTICE '✅ Politiques RLS configurées';
  ELSE
    RAISE NOTICE '❌ Erreur: Politiques RLS non configurées';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Configuration terminée !';
  RAISE NOTICE '📁 Dossiers recommandés:';
  RAISE NOTICE '   - investment-opportunities/';
  RAISE NOTICE '   - industrial-companies/';
  RAISE NOTICE '   - economic-countries/';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 URL d''accès:';
  RAISE NOTICE '   https://[votre-projet].supabase.co/storage/v1/object/public/images/[chemin-fichier]';
END $$;
